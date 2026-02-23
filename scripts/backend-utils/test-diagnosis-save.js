require('dotenv').config();
const Diagnosis = require('../models/Diagnosis');

async function testDiagnosisSave() {
  try {
    console.log('=== 진단 저장 테스트 시작 ===\n');
    
    // 테스트 데이터
    const testData = {
      patient_id: 1,
      patient_name: '테스트환자',
      patient_registration_number: 'TEST-001',
      gender: 'male',
      treatment_type: '보험진료',
      body_parts: '얼굴, 목',
      skin_symptoms: 'itching, burning',
      pain_vas: 5,
      duration: '1주일이상',
      skin_features: '발적, 인설',
      symptoms: '얼굴과 목 부위에 가려움증과 발적이 있습니다.',
      gpt_diagnosis: 'AI 테스트 진단',
      status: 'pending'
    };
    
    console.log('저장할 데이터:', JSON.stringify(testData, null, 2));
    console.log('\n저장 시도 중...\n');
    
    // 진단 저장
    const diagnosis = await Diagnosis.create(testData);
    
    console.log('✅ 진단 저장 성공!');
    console.log('생성된 진단 ID:', diagnosis.id);
    console.log('\n생성된 데이터:', JSON.stringify(diagnosis, null, 2));
    
    // 저장된 데이터 다시 조회
    const saved = await Diagnosis.findById(diagnosis.id);
    console.log('\n조회된 데이터:', JSON.stringify(saved, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    console.error('상세 오류:', error);
    process.exit(1);
  }
}

testDiagnosisSave();
