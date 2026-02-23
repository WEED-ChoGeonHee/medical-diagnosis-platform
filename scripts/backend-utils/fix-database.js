require('dotenv').config();
const { pool } = require('../config/database');

async function fixDatabase() {
  try {
    console.log('=== 데이터베이스 컬럼 수정 시작 ===\n');
    
    // symptom_type 컬럼을 NULL 허용으로 변경
    console.log('1. symptom_type 컬럼을 NULL 허용으로 변경...');
    try {
      await pool.query(`
        ALTER TABLE diagnoses 
        MODIFY COLUMN symptom_type VARCHAR(100) NULL DEFAULT NULL
      `);
      console.log('✅ symptom_type 컬럼 수정 완료\n');
    } catch (e) {
      if (e.code === 'ER_BAD_FIELD_ERROR') {
        console.log('⚠️ symptom_type 컬럼이 존재하지 않습니다 (정상)\n');
      } else {
        console.log('✅ symptom_type 이미 NULL 허용 또는 수정됨\n');
      }
    }
    
    // skin_type 컬럼도 확인
    console.log('2. skin_type 컬럼을 NULL 허용으로 변경...');
    try {
      await pool.query(`
        ALTER TABLE diagnoses 
        MODIFY COLUMN skin_type VARCHAR(100) NULL DEFAULT NULL
      `);
      console.log('✅ skin_type 컬럼 수정 완료\n');
    } catch (e) {
      if (e.code === 'ER_BAD_FIELD_ERROR') {
        console.log('⚠️ skin_type 컬럼이 존재하지 않습니다 (정상)\n');
      } else {
        console.log('✅ skin_type 이미 NULL 허용 또는 수정됨\n');
      }
    }
    
    // 테이블 구조 확인
    console.log('3. diagnoses 테이블 구조 확인:\n');
    const [columns] = await pool.query('DESCRIBE diagnoses');
    columns.forEach(col => {
      console.log(`  ${col.Field} - ${col.Type} - NULL: ${col.Null} - Default: ${col.Default}`);
    });
    
    await pool.end();
    console.log('\n✅ 데이터베이스 수정 완료!');
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류:', error);
    process.exit(1);
  }
}

fixDatabase();
