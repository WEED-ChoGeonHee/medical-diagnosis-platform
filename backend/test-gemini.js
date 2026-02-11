const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent';

async function testGeminiAPI() {
  console.log('🧪 Gemini API 테스트 시작...\n');
  console.log('📌 API 키:', GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 10)}...` : '❌ 없음');
  console.log('📌 API URL:', GEMINI_API_URL);
  console.log('\n' + '='.repeat(60) + '\n');

  if (!GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY가 설정되지 않았습니다.');
    process.exit(1);
  }

  try {
    // 테스트 요청 1: 간단한 질문
    console.log('📝 테스트 1: 간단한 질문\n');
    const testResponse1 = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: '안녕하세요. 간단히 자기소개를 해주세요.'
          }]
        }]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const response1 = testResponse1.data.candidates[0].content.parts[0].text;
    console.log('✅ 응답 받음:');
    console.log(response1);
    console.log('\n' + '='.repeat(60) + '\n');

    // 테스트 요청 2: 피부과 진단 시뮬레이션
    console.log('📝 테스트 2: 피부과 진단 시뮬레이션\n');
    const testResponse2 = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `당신은 피부과 전문의입니다. 환자의 피부 증상을 바탕으로 가능한 진단명을 제시하고, 관련 의학 정보를 제공해주세요. 이것은 참고용이며 정확한 진단은 피부과 전문의와 상담이 필요함을 명시하세요.

증상 종류: 여드름/뾰루지
피부 타입: 지성
증상 설명: 이마와 턱 부위에 붉은 여드름이 자주 발생하며, 가끔 통증이 있습니다. 최근 2주 정도 지속되고 있습니다.

위 정보를 바탕으로 가능한 피부과 진단명과 설명을 제공해주세요.`
          }]
        }]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const response2 = testResponse2.data.candidates[0].content.parts[0].text;
    console.log('✅ 피부과 진단 응답:');
    console.log(response2);
    console.log('\n' + '='.repeat(60) + '\n');

    // 테스트 요청 3: 무료 티어 쿼터 확인
    console.log('📝 테스트 3: 연속 요청 테스트 (무료 티어 확인)\n');
    for (let i = 1; i <= 3; i++) {
      console.log(`  요청 ${i}/3...`);
      const testResponse = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: `${i}번째 테스트입니다. 간단히 "테스트 ${i} 성공"이라고 답해주세요.`
            }]
          }]
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      console.log(`  ✅ 응답 ${i}: ${testResponse.data.candidates[0].content.parts[0].text.substring(0, 50)}...`);
      // 무료 티어 Rate limit을 위한 딜레이
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n' + '='.repeat(60) + '\n');
    console.log('🎉 모든 테스트 통과!\n');
    console.log('💡 무료 티어 제한 사항:');
    console.log('   - RPM (분당 요청): 15');
    console.log('   - TPM (분당 토큰): 1,000,000');
    console.log('   - RPD (일당 요청): 1,500');
    console.log('\n✅ Gemini API가 정상적으로 작동합니다!');

  } catch (error) {
    console.error('\n❌ Gemini API 오류 발생:\n');
    if (error.response) {
      console.error('상태 코드:', error.response.status);
      console.error('응답 데이터:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('오류 메시지:', error.message);
    }
    process.exit(1);
  }
}

testGeminiAPI();
