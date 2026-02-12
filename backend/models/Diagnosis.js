const { pool } = require('../config/database');

const Diagnosis = {
  // 진단 생성
  async create(diagnosisData) {
    const { patient_id, patient_name, symptom_type, skin_type, symptoms, gpt_diagnosis, status = 'pending' } = diagnosisData;

    const [result] = await pool.query(
      'INSERT INTO diagnoses (patient_id, patient_name, symptom_type, skin_type, symptoms, gpt_diagnosis, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [patient_id, patient_name, symptom_type, skin_type, symptoms, gpt_diagnosis, status]
    );

    return { id: result.insertId, patient_id, patient_name, symptom_type, skin_type, symptoms, gpt_diagnosis, status };
  },

  // 이미지 추가
  async addImage(diagnosisId, imagePath) {
    await pool.query(
      'INSERT INTO diagnosis_images (diagnosis_id, image_path) VALUES (?, ?)',
      [diagnosisId, imagePath]
    );
  },

  // 의학 논문 추가
  async addPaper(diagnosisId, paper) {
    await pool.query(
      'INSERT INTO medical_papers (diagnosis_id, title, url, summary) VALUES (?, ?, ?, ?)',
      [diagnosisId, paper.title, paper.url || null, paper.summary]
    );
  },

  // ID로 진단 찾기 (이미지, 논문 포함)
  async findById(id) {
    const [diagnoses] = await pool.query(
      `SELECT d.*, u.name as patient_name, u.email as patient_email, u.phone as patient_phone
       FROM diagnoses d
       JOIN users u ON d.patient_id = u.id
       WHERE d.id = ?`,
      [id]
    );

    if (diagnoses.length === 0) return null;

    const diagnosis = diagnoses[0];

    // 이미지 가져오기
    const [images] = await pool.query(
      'SELECT image_path FROM diagnosis_images WHERE diagnosis_id = ?',
      [id]
    );
    diagnosis.images = images.map(img => img.image_path);

    // 논문 가져오기
    const [papers] = await pool.query(
      'SELECT title, url, summary FROM medical_papers WHERE diagnosis_id = ?',
      [id]
    );
    diagnosis.medicalPapers = papers;

    // 환자 정보 구조화
    diagnosis.patient = {
      _id: diagnosis.patient_id,
      name: diagnosis.patient_name,
      email: diagnosis.patient_email,
      phone: diagnosis.patient_phone
    };

    // camelCase 별칭 추가
    diagnosis._id = diagnosis.id;
    diagnosis.gptDiagnosis = diagnosis.gpt_diagnosis;
    diagnosis.doctorNotes = diagnosis.doctor_notes;
    diagnosis.createdAt = diagnosis.created_at;
    diagnosis.updatedAt = diagnosis.updated_at;

    return diagnosis;
  },

  // 환자의 진단 목록 조회
  async findByPatientId(patientId) {
    const [diagnoses] = await pool.query(
      'SELECT * FROM diagnoses WHERE patient_id = ? ORDER BY created_at DESC',
      [patientId]
    );

    // 각 진단에 이미지 추가
    for (let diagnosis of diagnoses) {
      const [images] = await pool.query(
        'SELECT image_path FROM diagnosis_images WHERE diagnosis_id = ?',
        [diagnosis.id]
      );
      diagnosis.images = images.map(img => img.image_path);
      diagnosis._id = diagnosis.id; // 프론트엔드 호환
    }

    return diagnoses;
  },

  // 모든 진단 조회 (관리자용)
  async findAll(options = {}) {
    const { status, symptom_type, skin_type, page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    let query = `
      SELECT d.*, u.name as patient_name, u.email as patient_email, u.phone as patient_phone
      FROM diagnoses d
      JOIN users u ON d.patient_id = u.id
    `;

    const params = [];
    const conditions = [];

    if (status) {
      conditions.push('d.status = ?');
      params.push(status);
    }

    if (symptom_type) {
      conditions.push('d.symptom_type = ?');
      params.push(symptom_type);
    }

    if (skin_type) {
      conditions.push('d.skin_type = ?');
      params.push(skin_type);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY d.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [diagnoses] = await pool.query(query, params);

    // 각 진단에 이미지 추가 및 환자 정보 구조화
    for (let diagnosis of diagnoses) {
      const [images] = await pool.query(
        'SELECT image_path FROM diagnosis_images WHERE diagnosis_id = ?',
        [diagnosis.id]
      );
      diagnosis.images = images.map(img => img.image_path);
      diagnosis._id = diagnosis.id;
      diagnosis.gptDiagnosis = diagnosis.gpt_diagnosis;
      diagnosis.doctorNotes = diagnosis.doctor_notes;
      diagnosis.createdAt = diagnosis.created_at;
      diagnosis.updatedAt = diagnosis.updated_at;
      diagnosis.patient = {
        _id: diagnosis.patient_id,
        name: diagnosis.patient_name,
        email: diagnosis.patient_email,
        phone: diagnosis.patient_phone
      };
    }

    // 총 개수
    let countQuery = 'SELECT COUNT(*) as count FROM diagnoses';
    const countParams = [];
    const countConditions = [];

    if (status) {
      countConditions.push('status = ?');
      countParams.push(status);
    }

    if (symptom_type) {
      countConditions.push('symptom_type = ?');
      countParams.push(symptom_type);
    }

    if (skin_type) {
      countConditions.push('skin_type = ?');
      countParams.push(skin_type);
    }

    if (countConditions.length > 0) {
      countQuery += ' WHERE ' + countConditions.join(' AND ');
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].count;

    return {
      diagnoses,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    };
  },

  // 진단 업데이트
  async update(id, updateData) {
    const { doctor_notes, status } = updateData;

    await pool.query(
      'UPDATE diagnoses SET doctor_notes = ?, status = ? WHERE id = ?',
      [doctor_notes, status, id]
    );

    return await this.findById(id);
  },

  // 통계
  async getStats() {
    const [totalPatients] = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE role = ?',
      ['patient']
    );

    const [totalDiagnoses] = await pool.query('SELECT COUNT(*) as count FROM diagnoses');

    const [pendingDiagnoses] = await pool.query(
      'SELECT COUNT(*) as count FROM diagnoses WHERE status = ?',
      ['pending']
    );

    const [reviewedDiagnoses] = await pool.query(
      'SELECT COUNT(*) as count FROM diagnoses WHERE status = ?',
      ['reviewed']
    );

    // 증상 종류별 통계
    const [symptomStats] = await pool.query(
      'SELECT symptom_type, COUNT(*) as count FROM diagnoses GROUP BY symptom_type'
    );

    // 피부 타입별 통계
    const [skinTypeStats] = await pool.query(
      'SELECT skin_type, COUNT(*) as count FROM diagnoses GROUP BY skin_type'
    );

    return {
      totalPatients: totalPatients[0].count,
      totalDiagnoses: totalDiagnoses[0].count,
      pendingDiagnoses: pendingDiagnoses[0].count,
      reviewedDiagnoses: reviewedDiagnoses[0].count,
      symptomStats: symptomStats,
      skinTypeStats: skinTypeStats
    };
  }
};

module.exports = Diagnosis;
