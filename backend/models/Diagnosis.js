const { pool } = require('../config/database');

const Diagnosis = {
  // 진단 생성
  async create(diagnosisData) {
    const { 
      patient_id, 
      patient_name, 
      patient_registration_number,
      gender,
      treatment_type,
      body_parts,
      skin_symptoms,
      pain_vas,
      duration,
      skin_features,
      symptoms, 
      gpt_diagnosis, 
      status = 'pending' 
    } = diagnosisData;

    const [result] = await pool.query(
      `INSERT INTO diagnoses (
        patient_id, patient_name, patient_registration_number, gender, treatment_type, 
        body_parts, skin_symptoms, pain_vas, duration, skin_features, symptoms, gpt_diagnosis, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patient_id, patient_name, patient_registration_number, gender, treatment_type,
        body_parts, skin_symptoms, pain_vas || 0, duration, skin_features, symptoms, gpt_diagnosis, status
      ]
    );

    return { 
      id: result.insertId, 
      patient_id, 
      patient_name, 
      patient_registration_number,
      gender,
      treatment_type,
      body_parts,
      skin_symptoms,
      pain_vas,
      duration,
      skin_features,
      symptoms, 
      gpt_diagnosis, 
      status 
    };
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
    diagnosis.patientRegistrationNumber = diagnosis.patient_registration_number;
    diagnosis.treatmentType = diagnosis.treatment_type;
    diagnosis.bodyParts = diagnosis.body_parts;
    diagnosis.skinSymptoms = diagnosis.skin_symptoms;
    diagnosis.painVas = diagnosis.pain_vas;
    diagnosis.skinFeatures = diagnosis.skin_features;
    // 차팅 관련 camelCase
    diagnosis.chartDiagnosisName = diagnosis.chart_diagnosis_name;
    diagnosis.chartIcdCode = diagnosis.chart_icd_code;
    diagnosis.chartInsuranceCode = diagnosis.chart_insurance_code;
    diagnosis.chartTreatmentGuideline = diagnosis.chart_treatment_guideline;
    diagnosis.chartSoapS = diagnosis.chart_soap_s;
    diagnosis.chartSoapO = diagnosis.chart_soap_o;
    diagnosis.chartSoapA = diagnosis.chart_soap_a;
    diagnosis.chartSoapP = diagnosis.chart_soap_p;

    return diagnosis;
  },

  // 환자의 진단 목록 조회
  async findByPatientId(patientId) {
    const [diagnoses] = await pool.query(
      'SELECT * FROM diagnoses WHERE patient_id = ? ORDER BY created_at DESC',
      [patientId]
    );

    // 각 진단에 이미지 추가 및 camelCase 변환
    for (let diagnosis of diagnoses) {
      const [images] = await pool.query(
        'SELECT image_path FROM diagnosis_images WHERE diagnosis_id = ?',
        [diagnosis.id]
      );
      diagnosis.images = images.map(img => img.image_path);
      
      // camelCase 별칭 추가 (프론트엔드 호환)
      diagnosis._id = diagnosis.id;
      diagnosis.gptDiagnosis = diagnosis.gpt_diagnosis;
      diagnosis.doctorNotes = diagnosis.doctor_notes;
      diagnosis.createdAt = diagnosis.created_at;
      diagnosis.updatedAt = diagnosis.updated_at;
      diagnosis.patientRegistrationNumber = diagnosis.patient_registration_number;
      diagnosis.treatmentType = diagnosis.treatment_type;
      diagnosis.bodyParts = diagnosis.body_parts;
      diagnosis.skinSymptoms = diagnosis.skin_symptoms;
      diagnosis.painVas = diagnosis.pain_vas;
      diagnosis.skinFeatures = diagnosis.skin_features;
    }

    return diagnoses;
  },

  // 환자 등록번호로 진단 히스토리 조회
  async findByPatientRegistrationNumber(patientRegistrationNumber) {
    const [diagnoses] = await pool.query(
      `SELECT d.*, u.name as user_name, u.email as patient_email, u.phone as patient_phone
       FROM diagnoses d
       JOIN users u ON d.patient_id = u.id
       WHERE d.patient_registration_number = ? 
       ORDER BY d.created_at DESC`,
      [patientRegistrationNumber]
    );

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
      diagnosis.patientRegistrationNumber = diagnosis.patient_registration_number;
      diagnosis.treatmentType = diagnosis.treatment_type;
      diagnosis.bodyParts = diagnosis.body_parts;
      diagnosis.skinSymptoms = diagnosis.skin_symptoms;
      diagnosis.painVas = diagnosis.pain_vas;
      diagnosis.skinFeatures = diagnosis.skin_features;
      diagnosis.patient = {
        _id: diagnosis.patient_id,
        name: diagnosis.patient_name,
        email: diagnosis.patient_email,
        phone: diagnosis.patient_phone
      };
    }

    return diagnoses;
  },

  // 모든 진단 조회 (관리자용)
  async findAll(options = {}) {
    const { status, treatment_type, patient_registration_number, page = 1, limit = 10 } = options;
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

    if (treatment_type) {
      conditions.push('d.treatment_type = ?');
      params.push(treatment_type);
    }

    if (patient_registration_number) {
      conditions.push('d.patient_registration_number LIKE ?');
      params.push(`%${patient_registration_number}%`);
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
      diagnosis.patientRegistrationNumber = diagnosis.patient_registration_number;
      diagnosis.treatmentType = diagnosis.treatment_type;
      diagnosis.bodyParts = diagnosis.body_parts;
      diagnosis.skinSymptoms = diagnosis.skin_symptoms;
      diagnosis.painVas = diagnosis.pain_vas;
      diagnosis.skinFeatures = diagnosis.skin_features;
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

    if (treatment_type) {
      countConditions.push('treatment_type = ?');
      countParams.push(treatment_type);
    }

    if (patient_registration_number) {
      countConditions.push('patient_registration_number LIKE ?');
      countParams.push(`%${patient_registration_number}%`);
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

  // 증상 정보 업데이트 (의사가 수정)
  async updateSymptoms(id, data) {
    const { skin_symptoms, skin_features, symptoms, body_parts } = data;

    await pool.query(
      `UPDATE diagnoses SET skin_symptoms = ?, skin_features = ?, symptoms = ?, body_parts = ? WHERE id = ?`,
      [skin_symptoms, skin_features, symptoms, body_parts, id]
    );

    return await this.findById(id);
  },

  // 차팅 정보 업데이트
  async updateCharting(id, chartData) {
    const {
      chart_diagnosis_name,
      chart_icd_code,
      chart_insurance_code,
      chart_treatment_guideline,
      chart_soap_s,
      chart_soap_o,
      chart_soap_a,
      chart_soap_p
    } = chartData;

    await pool.query(
      `UPDATE diagnoses SET 
        chart_diagnosis_name = ?, chart_icd_code = ?, chart_insurance_code = ?,
        chart_treatment_guideline = ?, chart_soap_s = ?, chart_soap_o = ?,
        chart_soap_a = ?, chart_soap_p = ?
       WHERE id = ?`,
      [
        chart_diagnosis_name, chart_icd_code, chart_insurance_code,
        chart_treatment_guideline, chart_soap_s, chart_soap_o,
        chart_soap_a, chart_soap_p, id
      ]
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

    // 진료 종류별 통계
    const [treatmentStats] = await pool.query(
      'SELECT treatment_type, COUNT(*) as count FROM diagnoses WHERE treatment_type IS NOT NULL GROUP BY treatment_type'
    );

    // 부위별 통계
    const [bodyPartStats] = await pool.query(
      'SELECT body_parts, COUNT(*) as count FROM diagnoses WHERE body_parts IS NOT NULL GROUP BY body_parts'
    );

    return {
      totalPatients: totalPatients[0].count,
      totalDiagnoses: totalDiagnoses[0].count,
      pendingDiagnoses: pendingDiagnoses[0].count,
      reviewedDiagnoses: reviewedDiagnoses[0].count,
      treatmentStats: treatmentStats,
      bodyPartStats: bodyPartStats
    };
  },

  // 피부과 진단 상세 정보 조회 (진단명 검색)
  async searchDermatologyDiagnosis(searchTerm) {
    const [results] = await pool.query(
      `SELECT * FROM dermatology_diagnoses 
       WHERE diagnosis_name LIKE ? OR diagnosis_name_kr LIKE ? OR icd_code LIKE ?`,
      [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
    );
    return results;
  },

  // 피부과 진단 상세 정보 ID로 조회
  async getDermatologyDiagnosisById(id) {
    const [results] = await pool.query(
      'SELECT * FROM dermatology_diagnoses WHERE id = ?',
      [id]
    );
    return results[0] || null;
  },

  // 모든 피부과 진단 상세 정보 조회
  async getAllDermatologyDiagnoses() {
    const [results] = await pool.query('SELECT * FROM dermatology_diagnoses ORDER BY diagnosis_name_kr');
    return results;
  }
};

module.exports = Diagnosis;
