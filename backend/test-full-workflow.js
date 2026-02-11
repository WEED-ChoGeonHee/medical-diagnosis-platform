const axios = require('axios');

const API_URL = 'http://10.10.30.175:5000/api';

async function testFullWorkflow() {
  console.log('🧪 전체 워크플로우 테스트 시작...\n');

  try {
    // 0. 회원가입
    console.log('0️⃣ 회원가입 테스트...');
    try {
      await axios.post(`${API_URL}/auth/register`, {
        name: 'API 테스트 사용자',
        email: 'apitest@test.com',
        password: 'test1234'
      });
      console.log('✅ 회원가입 성공!\n');
    } catch (registerError) {
      if (registerError.response?.status === 400) {
        console.log('ℹ️  이미 등록된 계정 사용\n');
      } else {
        throw registerError;
      }
    }

    // 1. 로그인
    console.log('1️⃣ 로그인 테스트...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'apitest@test.com',
      password: 'test1234'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ 로그인 성공!');
    console.log(`   토큰: ${token.substring(0, 20)}...\n`);

    // 2. 진단 등록 (Gemini API 호출 포함)
    console.log('2️⃣ 진단 등록 테스트 (Gemini API 호출)...');
    const diagnosisResponse = await axios.post(
      `${API_URL}/diagnoses`,
      {
        patient_name: 'API 테스트 환자',
        symptom_type: '여드름/뾰루지',
        skin_type: '지성',
        symptoms: '이마와 턱 부위에 붉은 여드름이 자주 발생하며, 가끔 통증이 있습니다. 최근 2주 정도 지속되고 있습니다.'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('✅ 진단 등록 성공!');
    console.log(`   진단 ID: ${diagnosisResponse.data.diagnosis._id}`);
    console.log(`   환자 이름: ${diagnosisResponse.data.diagnosis.patient_name}`);
    console.log(`   상태: ${diagnosisResponse.data.diagnosis.status}\n`);

    // 3. AI 진단 결과 확인
    const diagnosisId = diagnosisResponse.data.diagnosis._id;
    console.log('3️⃣ AI 진단 결과 조회...');
    const detailResponse = await axios.get(
      `${API_URL}/diagnoses/${diagnosisId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('✅ 진단 조회 성공!\n');
    console.log('📋 Gemini AI 진단 결과:');
    console.log('━'.repeat(80));
    console.log(detailResponse.data.gptDiagnosis);
    console.log('━'.repeat(80));

    console.log('\n🎉 모든 테스트 통과!');
    console.log('\n💡 테스트 결과:');
    console.log('   ✅ 로그인 성공');
    console.log('   ✅ 진단 등록 성공');
    console.log('   ✅ Gemini API 호출 성공');
    console.log('   ✅ AI 진단 결과 생성 성공');

  } catch (error) {
    console.error('\n❌ 테스트 실패:');
    if (error.response) {
      console.error(`   상태 코드: ${error.response.status}`);
      console.error(`   에러 메시지: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(`   에러: ${error.message}`);
    }
  }
}

testFullWorkflow();
