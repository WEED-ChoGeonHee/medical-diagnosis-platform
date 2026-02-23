const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrateData() {
  let localConn, aivenConn;
  
  try {
    console.log('📊 데이터 마이그레이션 시작...\n');
    
    // 로컬 MySQL 연결
    console.log('🔌 로컬 MySQL 연결 중...');
    localConn = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '',
      database: 'medical_diagnosis'
    });
    console.log('✅ 로컬 MySQL 연결 완료\n');
    
    // Aiven MySQL 연결
    console.log('🔌 Aiven MySQL 연결 중...');
    aivenConn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false }
    });
    console.log('✅ Aiven MySQL 연결 완료\n');
    
    // 테이블 생성
    console.log('📋 테이블 생성 중...');
    
    await aivenConn.query(`
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
    
    await aivenConn.query(`
      CREATE TABLE IF NOT EXISTS diagnoses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT NOT NULL,
        patient_name VARCHAR(255),
        symptom_type VARCHAR(100) NOT NULL,
        skin_type VARCHAR(100) NOT NULL,
        symptoms TEXT NOT NULL,
        gpt_diagnosis TEXT,
        medical_papers JSON,
        images JSON,
        status ENUM('pending', 'reviewed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    await aivenConn.query(`
      CREATE TABLE IF NOT EXISTS diagnosis_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        diagnosis_id INT NOT NULL,
        image_path VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (diagnosis_id) REFERENCES diagnoses(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    console.log('✅ 테이블 생성 완료\n');
    
    // 사용자 데이터 마이그레이션
    console.log('👥 사용자 데이터 마이그레이션 중...');
    const [users] = await localConn.query('SELECT * FROM users');
    
    for (const user of users) {
      await aivenConn.query(
        'INSERT INTO users (id, email, password, name, role, phone, created_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE email=email',
        [user.id, user.email, user.password, user.name, user.role, user.phone, user.created_at]
      );
    }
    console.log(`✅ 사용자 ${users.length}명 마이그레이션 완료\n`);
    
    // 진단 데이터 마이그레이션
    console.log('🔬 진단 데이터 마이그레이션 중...');
    const [diagnoses] = await localConn.query('SELECT * FROM diagnoses');
    
    for (const diagnosis of diagnoses) {
      // status 값 변환 (completed → reviewed)
      const status = diagnosis.status === 'completed' ? 'reviewed' : diagnosis.status;
      
      await aivenConn.query(
        'INSERT INTO diagnoses (id, patient_id, patient_name, symptom_type, skin_type, symptoms, gpt_diagnosis, medical_papers, images, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE patient_name=patient_name',
        [
          diagnosis.id,
          diagnosis.patient_id,
          diagnosis.patient_name,
          diagnosis.symptom_type,
          diagnosis.skin_type,
          diagnosis.symptoms,
          diagnosis.gpt_diagnosis,
          diagnosis.medical_papers,
          diagnosis.images,
          status, // 변환된 status 사용
          diagnosis.created_at
        ]
      );
    }
    console.log(`✅ 진단 ${diagnoses.length}건 마이그레이션 완료\n`);
    
    // 진단 이미지 데이터 마이그레이션 (있는 경우)
    try {
      const [images] = await localConn.query('SELECT * FROM diagnosis_images');
      if (images.length > 0) {
        console.log('🖼️  이미지 데이터 마이그레이션 중...');
        for (const image of images) {
          await aivenConn.query(
            'INSERT INTO diagnosis_images (id, diagnosis_id, image_path, created_at) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE image_path=image_path',
            [image.id, image.diagnosis_id, image.image_path, image.created_at]
          );
        }
        console.log(`✅ 이미지 ${images.length}개 마이그레이션 완료\n`);
      }
    } catch (e) {
      console.log('ℹ️  이미지 테이블 없음 (건너뜀)\n');
    }
    
    // 최종 확인
    console.log('📊 마이그레이션 결과 확인:');
    const [aivenUsers] = await aivenConn.query('SELECT COUNT(*) as count FROM users');
    const [aivenDiagnoses] = await aivenConn.query('SELECT COUNT(*) as count FROM diagnoses');
    console.log(`  ✅ 사용자: ${aivenUsers[0].count}명`);
    console.log(`  ✅ 진단: ${aivenDiagnoses[0].count}건`);
    
    console.log('\n🎉 데이터 마이그레이션 완료!\n');
    
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error.message);
    console.error(error);
  } finally {
    if (localConn) await localConn.end();
    if (aivenConn) await aivenConn.end();
  }
}

migrateData();
