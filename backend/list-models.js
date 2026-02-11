const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
  try {
    console.log('📋 사용 가능한 Gemini 모델 목록 확인 중...\n');
    
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`
    );

    console.log('✅ 사용 가능한 모델:\n');
    response.data.models.forEach(model => {
      console.log(`- ${model.name}`);
      console.log(`  설명: ${model.description}`);
      console.log(`  지원 메서드: ${model.supportedGenerationMethods.join(', ')}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ 오류:', error.response?.data || error.message);
  }
}

listModels();
