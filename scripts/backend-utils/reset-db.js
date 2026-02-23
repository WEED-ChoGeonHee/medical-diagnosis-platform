const mysql = require('mysql2/promise');
require('dotenv').config();

async function resetDatabase() {
  try {
    // MySQL 연결 (데이터베이스 선택 없이)
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      charset: 'utf8mb4'
    });

    console.log('MySQL 연결 성공');

    // 기존 데이터베이스 삭제
    await connection.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);
    console.log('기존 데이터베이스 삭제 완료');

    // 새 데이터베이스 생성 (UTF-8MB4)
    await connection.query(
      `CREATE DATABASE ${process.env.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log('새 데이터베이스 생성 완료 (UTF-8MB4)');

    // 데이터베이스 선택
    await connection.query(`USE ${process.env.DB_NAME}`);

    // 사용자 테이블 생성
    await connection.query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        role ENUM('patient', 'doctor') DEFAULT 'patient',
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('users 테이블 생성 완료');

    // 진단 테이블 생성
    await connection.query(`
      CREATE TABLE diagnoses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT NOT NULL,
        symptoms TEXT NOT NULL,
        gpt_diagnosis TEXT,
        status ENUM('pending', 'reviewed', 'completed') DEFAULT 'pending',
        doctor_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('diagnoses 테이블 생성 완료');

    // 진단 이미지 테이블 생성
    await connection.query(`
      CREATE TABLE diagnosis_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        diagnosis_id INT NOT NULL,
        image_path VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (diagnosis_id) REFERENCES diagnoses(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('diagnosis_images 테이블 생성 완료');

    // 의학 논문 테이블 생성
    await connection.query(`
      CREATE TABLE medical_papers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        diagnosis_id INT NOT NULL,
        title VARCHAR(500),
        url VARCHAR(500),
        summary TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (diagnosis_id) REFERENCES diagnoses(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('medical_papers 테이블 생성 완료');

    await connection.end();
    console.log('\n✅ 데이터베이스 리셋 완료!');
    console.log('이제 서버를 시작할 수 있습니다.');
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

resetDatabase();
