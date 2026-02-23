const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function testConnection() {
  let conn;
  
  try {
    console.log('\n🔌 Aiven MySQL 연결 테스트...\n');
    console.log(`호스트: ${process.env.DB_HOST}`);
    console.log(`포트: ${process.env.DB_PORT}`);
    console.log(`사용자: ${process.env.DB_USER}`);
    console.log(`데이터베이스: ${process.env.DB_NAME}\n`);
    
    conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false },
      connectTimeout: 20000
    });
    
    console.log('✅ 연결 성공!\n');
    
    // 버전 확인
    const [rows] = await conn.query('SELECT VERSION() as version');
    console.log(`MySQL 버전: ${rows[0].version}\n`);
    
    // 현재 데이터베이스 확인
    const [dbRows] = await conn.query('SELECT DATABASE() as db');
    console.log(`현재 DB: ${dbRows[0].db}\n`);
    
    // 테이블 목록 확인
    const [tables] = await conn.query('SHOW TABLES');
    console.log(`테이블 수: ${tables.length}개`);
    if (tables.length > 0) {
      console.log('테이블 목록:');
      tables.forEach((table) => {
        console.log(`  - ${Object.values(table)[0]}`);
      });
    } else {
      console.log('  (테이블 없음 - 마이그레이션 필요)\n');
    }
    
    console.log('\n🎉 Aiven MySQL 연결 성공!\n');
    
  } catch (error) {
    console.error('\n❌ 연결 실패:', error.message);
    console.error('\n원인:');
    
    if (error.code === 'HANDSHAKE_NO_SSL_SUPPORT') {
      console.error('  - Aiven 서비스가 아직 시작 중일 수 있습니다');
      console.error('  - 2-3분 후 다시 시도해주세요');
      console.error('  - https://console.aiven.io 에서 서비스 상태 확인');
    } else if (error.code === 'ENOTFOUND') {
      console.error('  - 호스트 주소를 찾을 수 없습니다');
      console.error('  - .env 파일의 DB_HOST 확인');
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      console.error('  - 서비스에 연결할 수 없습니다');
      console.error('  - 방화벽 또는 네트워크 확인');
    } else {
      console.error(`  - 에러 코드: ${error.code}`);
    }
    
    console.log('');
  } finally {
    if (conn) await conn.end();
  }
}

testConnection();
