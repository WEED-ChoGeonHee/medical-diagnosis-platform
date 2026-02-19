const mysql = require('mysql2/promise');
require('dotenv').config();

const poolConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4'
};

// Aiven SSL 설정
if (process.env.DB_SSL === 'true') {
  poolConfig.ssl = {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  };
}

async function updatePatientDates() {
  let connection;
  try {
    console.log('데이터베이스 연결 중...');
    connection = await mysql.createConnection(poolConfig);
    console.log('데이터베이스 연결 성공!');

    // created_at이 NULL인 환자들 찾기
    const [patientsWithoutDate] = await connection.query(
      `SELECT id, name, email, created_at FROM users WHERE role = 'patient' AND created_at IS NULL`
    );

    console.log(`\n가입일이 없는 환자 ${patientsWithoutDate.length}명 발견`);

    if (patientsWithoutDate.length === 0) {
      console.log('모든 환자가 가입일을 가지고 있습니다.');
      await connection.end();
      return;
    }

    // 현재 날짜와 시간
    const currentDate = new Date();
    console.log(`\n현재 날짜: ${currentDate.toLocaleString('ko-KR')}`);

    // 각 환자의 created_at 업데이트
    for (const patient of patientsWithoutDate) {
      await connection.query(
        `UPDATE users SET created_at = ? WHERE id = ?`,
        [currentDate, patient.id]
      );
      console.log(`✓ ${patient.name} (${patient.email}) - 가입일 업데이트 완료`);
    }

    console.log(`\n총 ${patientsWithoutDate.length}명의 환자 가입일이 업데이트되었습니다.`);

    // 업데이트 확인
    const [updatedPatients] = await connection.query(
      `SELECT name, email, created_at FROM users WHERE role = 'patient' ORDER BY created_at DESC`
    );

    console.log('\n=== 업데이트된 환자 목록 ===');
    updatedPatients.forEach(patient => {
      const dateStr = patient.created_at ? new Date(patient.created_at).toLocaleString('ko-KR') : '가입일 없음';
      console.log(`${patient.name} (${patient.email}): ${dateStr}`);
    });

    await connection.end();
    console.log('\n데이터베이스 연결 종료');
  } catch (error) {
    console.error('에러 발생:', error);
    if (connection) await connection.end();
    process.exit(1);
  }
}

updatePatientDates();
