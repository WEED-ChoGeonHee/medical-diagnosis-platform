require('dotenv').config();
const { pool } = require('./config/database');

async function testDiagnosis() {
  try {
    console.log('=== 진단 데이터 확인 ===\n');
    
    // 최근 진단 데이터 조회
    const [diagnoses] = await pool.query(
      'SELECT * FROM diagnoses ORDER BY created_at DESC LIMIT 1'
    );
    
    if (diagnoses.length === 0) {
      console.log('진단 데이터가 없습니다.');
      process.exit(0);
    }
    
    const diagnosis = diagnoses[0];
    console.log('진단 ID:', diagnosis.id);
    console.log('상태:', diagnosis.status);
    console.log('의사 소견:', diagnosis.doctor_notes);
    console.log('\n');
    
    // 논문 데이터 확인
    const [papers] = await pool.query(
      'SELECT * FROM medical_papers WHERE diagnosis_id = ?',
      [diagnosis.id]
    );
    
    console.log('=== 논문 데이터 ===');
    console.log('논문 개수:', papers.length);
    papers.forEach((paper, index) => {
      console.log(`\n논문 ${index + 1}:`);
      console.log('제목:', paper.title);
      console.log('URL:', paper.url);
      console.log('요약:', paper.summary?.substring(0, 100) + '...');
    });
    
    // 이미지 데이터 확인
    const [images] = await pool.query(
      'SELECT * FROM diagnosis_images WHERE diagnosis_id = ?',
      [diagnosis.id]
    );
    
    console.log('\n=== 이미지 데이터 ===');
    console.log('이미지 개수:', images.length);
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('오류:', error);
    process.exit(1);
  }
}

testDiagnosis();
