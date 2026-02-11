const mysql = require('mysql2/promise');

const poolConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
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
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = mysql.createPool(poolConfig);

// 테이블 생성
const initDatabase = async () => {
  try {
    // 데이터베이스 생성 (없으면)
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.end();

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
        symptom_type VARCHAR(100) NOT NULL,
        skin_type VARCHAR(100) NOT NULL,
        symptoms TEXT NOT NULL,
        gpt_diagnosis TEXT,
        status ENUM('pending', 'reviewed', 'completed') DEFAULT 'pending',
        doctor_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE
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
  } catch (error) {
    console.error('데이터베이스 초기화 오류:', error);
    throw error;
  }
};

module.exports = { pool, initDatabase };
