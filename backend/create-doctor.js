const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createDoctor() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: 'utf8mb4'
    });

    console.log('MySQL 연결 성공\n');

    // 의사 정보 입력
    const doctorEmail = 'doctor@hospital.com';
    const doctorPassword = 'doctor123';
    const doctorName = '김의사';
    const doctorPhone = '010-1234-5678';

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(doctorPassword, 10);

    // 의사 계정 생성
    await connection.query(
      'INSERT INTO users (email, password, name, phone, role) VALUES (?, ?, ?, ?, ?)',
      [doctorEmail, hashedPassword, doctorName, doctorPhone, 'doctor']
    );

    console.log('✅ 의사 계정 생성 완료!');
    console.log('==================================');
    console.log('이메일:', doctorEmail);
    console.log('비밀번호:', doctorPassword);
    console.log('이름:', doctorName);
    console.log('전화번호:', doctorPhone);
    console.log('==================================');
    console.log('\n관리자 대시보드(http://localhost:3001)에서 로그인하세요.');

    await connection.end();
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.error('❌ 이미 존재하는 이메일입니다.');
    } else {
      console.error('❌ 오류 발생:', error.message);
    }
    process.exit(1);
  }
}

createDoctor();
