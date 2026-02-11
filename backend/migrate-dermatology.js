// 피부과 전용 플랫폼 마이그레이션 스크립트
// 기존 diagnoses 테이블에 symptom_type, skin_type 컬럼 추가

require('dotenv').config();
const { pool } = require('./config/database');

async function migrate() {
  try {
    console.log('피부과 마이그레이션 시작...');

    // symptom_type 컬럼 추가
    try {
      await pool.query(`
        ALTER TABLE diagnoses 
        ADD COLUMN symptom_type VARCHAR(100) NOT NULL DEFAULT '기타'
        AFTER patient_id
      `);
      console.log('✓ symptom_type 컬럼 추가 완료');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ symptom_type 컬럼이 이미 존재합니다');
      } else {
        throw error;
      }
    }

    // skin_type 컬럼 추가
    try {
      await pool.query(`
        ALTER TABLE diagnoses 
        ADD COLUMN skin_type VARCHAR(100) NOT NULL DEFAULT '정상'
        AFTER symptom_type
      `);
      console.log('✓ skin_type 컬럼 추가 완료');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ skin_type 컬럼이 이미 존재합니다');
      } else {
        throw error;
      }
    }

    console.log('\n마이그레이션 완료! 피부과 플랫폼이 준비되었습니다.');
    process.exit(0);
  } catch (error) {
    console.error('마이그레이션 실패:', error);
    process.exit(1);
  }
}

migrate();
