require('dotenv').config();
const axios = require('axios');

async function testUpdateDiagnosis() {
  try {
    // 1. 로그인하여 토큰 가져오기
    console.log('=== 의사 로그인 ===\n');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'doctor@hospital.com',
      password: 'doctor123'
    });
    
    const token = loginResponse.data.token;
    console.log('로그인 성공, 토큰:', token.substring(0, 20) + '...\n');
    
    // 2. 진단 업데이트 테스트
    const diagnosisId = 13; // 위에서 확인한 진단 ID
    
    console.log('=== 진단 업데이트 테스트 ===');
    console.log('진단 ID:', diagnosisId);
    console.log('요청 데이터:', {
      doctorNotes: '테스트 의사 소견입니다.',
      status: 'completed'
    });
    
    const updateResponse = await axios.put(
      `http://localhost:5000/api/admin/diagnoses/${diagnosisId}`,
      {
        doctorNotes: '테스트 의사 소견입니다.',
        status: 'completed'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log('\n=== 응답 결과 ===');
    console.log('상태 코드:', updateResponse.status);
    console.log('메시지:', updateResponse.data.message);
    console.log('업데이트된 상태:', updateResponse.data.diagnosis.status);
    console.log('의사 소견:', updateResponse.data.diagnosis.doctorNotes);
    
  } catch (error) {
    console.error('\n=== 오류 발생 ===');
    if (error.response) {
      console.error('상태 코드:', error.response.status);
      console.error('오류 메시지:', error.response.data);
    } else if (error.request) {
      console.error('요청 오류:', error.request);
      console.error('서버가 응답하지 않습니다. 서버가 실행 중인지 확인하세요.');
    } else {
      console.error('오류:', error.message);
      console.error('전체 오류:', error);
    }
    process.exit(1);
  }
}

testUpdateDiagnosis();
