const mysql = require('mysql2/promise');

const poolConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
};

// Aiven SSL 설정 (클라우드 DB인 경우)
if (process.env.DB_SSL === 'true') {
  poolConfig.ssl = {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  };
}

console.log('DB 연결 설정:', {
  host: poolConfig.host,
  port: poolConfig.port,
  user: poolConfig.user,
  database: poolConfig.database,
  ssl: poolConfig.ssl ? 'enabled' : 'disabled'
});

const pool = mysql.createPool(poolConfig);

// 테이블 생성
const initDatabase = async () => {
  try {
    // 연결 테스트
    const testConnection = await pool.getConnection();
    console.log('✅ MySQL 연결 성공!');
    testConnection.release();

    // Aiven에서는 defaultdb가 이미 생성되어 있으므로 바로 테이블 생성
    console.log('📊 테이블 생성 시작...');

    // 사용자 테이블
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        role ENUM('patient', 'doctor') DEFAULT 'patient',
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 진단 테이블 (피부과 전용)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS diagnoses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT NOT NULL,
        patient_name VARCHAR(255),
        patient_registration_number VARCHAR(50),
        gender ENUM('male', 'female') DEFAULT 'male',
        treatment_type VARCHAR(100),
        body_parts TEXT,
        skin_symptoms TEXT,
        pain_vas INT DEFAULT 0,
        duration VARCHAR(50),
        skin_features TEXT,
        symptoms TEXT NOT NULL,
        gpt_diagnosis TEXT,
        status ENUM('pending', 'reviewed', 'completed') DEFAULT 'pending',
        doctor_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 피부과 진단 상세 정보 테이블 (ICD 코드, 보험 수가, 치료 가이드라인, SOAP)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS dermatology_diagnoses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        diagnosis_name VARCHAR(255) NOT NULL,
        diagnosis_name_kr VARCHAR(255) NOT NULL,
        icd_code VARCHAR(50) NOT NULL,
        insurance_code VARCHAR(100),
        treatment_guideline TEXT,
        soap_s TEXT,
        soap_o TEXT,
        soap_a TEXT,
        soap_p TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 진단 이미지 테이블
    await pool.query(`
      CREATE TABLE IF NOT EXISTS diagnosis_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        diagnosis_id INT NOT NULL,
        image_path VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (diagnosis_id) REFERENCES diagnoses(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 의학 논문 테이블
    await pool.query(`
      CREATE TABLE IF NOT EXISTS medical_papers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        diagnosis_id INT NOT NULL,
        title VARCHAR(500),
        url VARCHAR(500),
        summary TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (diagnosis_id) REFERENCES diagnoses(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('MySQL 데이터베이스 연결 및 테이블 생성 완료');

    // 마이그레이션: 누락된 컬럼 추가 (ALTER TABLE 직접 실행)
    console.log('📋 마이그레이션 확인 중...');
    const migrations = [
      `ALTER TABLE diagnoses ADD COLUMN doctor_notes TEXT`,
      `ALTER TABLE diagnoses ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
      `ALTER TABLE diagnoses ADD COLUMN patient_name VARCHAR(255)`,
      `ALTER TABLE diagnoses MODIFY COLUMN status ENUM('pending', 'reviewed', 'completed') DEFAULT 'pending'`,
      // 새 컬럼 추가 (환자 등록번호, 성별, 진료 정보 등)
      `ALTER TABLE diagnoses ADD COLUMN patient_registration_number VARCHAR(50)`,
      `ALTER TABLE diagnoses ADD COLUMN gender ENUM('male', 'female') DEFAULT 'male'`,
      `ALTER TABLE diagnoses ADD COLUMN treatment_type VARCHAR(100)`,
      `ALTER TABLE diagnoses ADD COLUMN body_parts TEXT`,
      `ALTER TABLE diagnoses ADD COLUMN skin_symptoms TEXT`,
      `ALTER TABLE diagnoses ADD COLUMN pain_vas INT DEFAULT 0`,
      `ALTER TABLE diagnoses ADD COLUMN duration VARCHAR(50)`,
      `ALTER TABLE diagnoses ADD COLUMN skin_features TEXT`,
      // 기존 컬럼을 NULL 허용으로 변경 (하위 호환성)
      `ALTER TABLE diagnoses MODIFY COLUMN symptom_type VARCHAR(100) NULL DEFAULT NULL`,
      `ALTER TABLE diagnoses MODIFY COLUMN skin_type VARCHAR(100) NULL DEFAULT NULL`,
      // 차팅 관련 컬럼 추가
      `ALTER TABLE diagnoses ADD COLUMN chart_diagnosis_name VARCHAR(255)`,
      `ALTER TABLE diagnoses ADD COLUMN chart_icd_code VARCHAR(50)`,
      `ALTER TABLE diagnoses ADD COLUMN chart_insurance_code VARCHAR(100)`,
      `ALTER TABLE diagnoses ADD COLUMN chart_treatment_guideline TEXT`,
      `ALTER TABLE diagnoses ADD COLUMN chart_soap_s TEXT`,
      `ALTER TABLE diagnoses ADD COLUMN chart_soap_o TEXT`,
      `ALTER TABLE diagnoses ADD COLUMN chart_soap_a TEXT`,
      `ALTER TABLE diagnoses ADD COLUMN chart_soap_p TEXT`,
    ];

    for (const sql of migrations) {
      try {
        await pool.query(sql);
        console.log(`  ✅ 마이그레이션 성공: ${sql.substring(0, 60)}...`);
      } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME' || e.errno === 1060) {
          // 컬럼이 이미 존재 — 정상
        } else {
          console.error(`  ⚠️ 마이그레이션 실패:`, e.message);
        }
      }
    }
    console.log('📋 마이그레이션 완료');
  } catch (error) {
    console.error('데이터베이스 초기화 오류:', error);
    throw error;
  }
};

module.exports = { pool, initDatabase };
