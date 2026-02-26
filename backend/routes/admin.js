const express = require('express');
const router = express.Router();
const Diagnosis = require('../models/Diagnosis');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// 모든 진단 목록 조회 (의사 전용)
router.get('/diagnoses', protect, authorize('doctor'), async (req, res) => {
  try {
    const { status, treatment_type, patient_registration_number, page = 1, limit = 10 } = req.query;

    const result = await Diagnosis.findAll({ status, treatment_type, patient_registration_number, page, limit });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '진단 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 환자 등록번호로 진단 히스토리 조회
router.get('/patient-history/:registrationNumber', protect, authorize('doctor'), async (req, res) => {
  try {
    const diagnoses = await Diagnosis.findByPatientRegistrationNumber(req.params.registrationNumber);
    res.json(diagnoses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '환자 진단 히스토리 조회 중 오류가 발생했습니다.' });
  }
});

// 피부과 진단 상세 정보 검색
router.get('/dermatology-diagnoses/search', protect, authorize('doctor'), async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: '검색어를 입력해주세요.' });
    }
    const results = await Diagnosis.searchDermatologyDiagnosis(q);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '피부과 진단 검색 중 오류가 발생했습니다.' });
  }
});

// 모든 피부과 진단 상세 정보 조회
router.get('/dermatology-diagnoses', protect, authorize('doctor'), async (req, res) => {
  try {
    const results = await Diagnosis.getAllDermatologyDiagnoses();
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '피부과 진단 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 피부과 진단 상세 정보 ID로 조회
router.get('/dermatology-diagnoses/:id', protect, authorize('doctor'), async (req, res) => {
  try {
    const result = await Diagnosis.getDermatologyDiagnosisById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: '진단 정보를 찾을 수 없습니다.' });
    }
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '피부과 진단 조회 중 오류가 발생했습니다.' });
  }
});

// 특정 환자의 진단 기록 조회
router.get('/patients/:patientId/diagnoses', protect, authorize('doctor'), async (req, res) => {
  try {
    const diagnoses = await Diagnosis.findByPatientId(req.params.patientId);
    res.json(diagnoses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '환자 진단 기록 조회 중 오류가 발생했습니다.' });
  }
});

// 진단에 의사 소견 추가
router.put('/diagnoses/:id', protect, authorize('doctor'), async (req, res) => {
  try {
    const { doctorNotes, status } = req.body;
    
    console.log('=== 진단 업데이트 요청 ===');
    console.log('진단 ID:', req.params.id);
    console.log('의사 소견:', doctorNotes);
    console.log('상태:', status);

    const diagnosis = await Diagnosis.update(req.params.id, {
      doctor_notes: doctorNotes,
      status: status || 'reviewed'
    });

    if (!diagnosis) {
      return res.status(404).json({ message: '진단을 찾을 수 없습니다.' });
    }

    console.log('업데이트된 진단 상태:', diagnosis.status);

    // update에서 findById를 호출하므로 이미 camelCase 변환됨
    res.json({
      message: '의사 소견이 추가되었습니다.',
      diagnosis: diagnosis
    });
  } catch (error) {
    console.error('의사 소견 추가 오류:', error);
    res.status(500).json({ message: '의사 소견 추가 중 오류가 발생했습니다.' });
  }
});

// 증상 정보 수정 (의사가 환자 증상 수정)
router.put('/diagnoses/:id/symptoms', protect, authorize('doctor'), async (req, res) => {
  try {
    const { skinSymptoms, skinFeatures, symptoms, bodyParts } = req.body;

    console.log('=== 증상 수정 요청 ===');
    console.log('진단 ID:', req.params.id);

    const diagnosis = await Diagnosis.updateSymptoms(req.params.id, {
      skin_symptoms: skinSymptoms,
      skin_features: skinFeatures,
      symptoms,
      body_parts: bodyParts
    });

    if (!diagnosis) {
      return res.status(404).json({ message: '진단을 찾을 수 없습니다.' });
    }

    res.json({ message: '증상이 수정되었습니다.', diagnosis });
  } catch (error) {
    console.error('증상 수정 오류:', error);
    res.status(500).json({ message: '증상 수정 중 오류가 발생했습니다.' });
  }
});

// 차팅 정보 저장
router.put('/diagnoses/:id/charting', protect, authorize('doctor'), async (req, res) => {
  try {
    const { 
      chartDiagnosisName, chartIcdCode, chartInsuranceCode,
      chartTreatmentGuideline, chartSoapS, chartSoapO, chartSoapA, chartSoapP
    } = req.body;

    console.log('=== 차팅 저장 요청 ===');
    console.log('진단 ID:', req.params.id);
    console.log('진단명:', chartDiagnosisName);

    const diagnosis = await Diagnosis.updateCharting(req.params.id, {
      chart_diagnosis_name: chartDiagnosisName,
      chart_icd_code: chartIcdCode,
      chart_insurance_code: chartInsuranceCode,
      chart_treatment_guideline: chartTreatmentGuideline,
      chart_soap_s: chartSoapS,
      chart_soap_o: chartSoapO,
      chart_soap_a: chartSoapA,
      chart_soap_p: chartSoapP
    });

    if (!diagnosis) {
      return res.status(404).json({ message: '진단을 찾을 수 없습니다.' });
    }

    res.json({
      message: '차팅 정보가 저장되었습니다.',
      diagnosis: diagnosis
    });
  } catch (error) {
    console.error('차팅 저장 오류:', error);
    res.status(500).json({ message: '차팅 저장 중 오류가 발생했습니다.' });
  }
});

// 환자 목록 조회
router.get('/patients', protect, authorize('doctor'), async (req, res) => {
  try {
    const patients = await User.findAllPatients();
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '환자 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 통계 정보
router.get('/stats', protect, authorize('doctor'), async (req, res) => {
  try {
    const stats = await Diagnosis.getStats();
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '통계 정보 조회 중 오류가 발생했습니다.' });
  }
});

// AI 증상 추천 (상위 3개)
router.post('/ai-suggest-symptoms', protect, authorize('doctor'), async (req, res) => {
  try {
    const { symptoms, bodyParts, skinSymptoms, images } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent';

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ message: 'AI 서비스가 설정되지 않았습니다.' });
    }

    if (!symptoms) {
      return res.status(400).json({ message: '증상 정보가 필요합니다.' });
    }

    const axios = require('axios');

    const prompt = `당신은 피부과 전문의입니다. 아래 환자 정보를 바탕으로 가능성이 높은 피부과 진단명 3개만 추천해주세요.

부위: ${bodyParts || '미지정'}
피부 증상: ${skinSymptoms || '미지정'}
증상 설명: ${symptoms}

응답은 반드시 아래 JSON 형식으로만 답변해주세요:
[
  {
    "diagnosis": "진단명1 (한글)",
    "confidence": 85,
    "description": "간단한 설명 (1-2줄)"
  },
  {
    "diagnosis": "진단명2 (한글)",
    "confidence": 70,
    "description": "간단한 설명 (1-2줄)"
  },
  {
    "diagnosis": "진단명3 (한글)",
    "confidence": 60,
    "description": "간단한 설명 (1-2줄)"
  }
]`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    
    // JSON 추출 (코드 블록 제거)
    const jsonMatch = aiResponse.match(/\[.*\]/s);
    let suggestions = [];
    
    if (jsonMatch) {
      suggestions = JSON.parse(jsonMatch[0]);
    } else {
      // JSON 파싱 실패 시 기본값
      suggestions = [
        { diagnosis: "진단 오류", confidence: 0, description: "AI 응답을 처리할 수 없습니다." }
      ];
    }

    // 최대 3개만 반환
    suggestions = suggestions.slice(0, 3);

    res.json({ suggestions });
  } catch (error) {
    console.error('AI 증상 추천 오류:', error.response?.data || error.message);
    res.status(500).json({ message: 'AI 증상 추천 중 오류가 발생했습니다.' });
  }
});

// 증상 수정 후 AI 진단 결과 + 의학 논문 재분석
router.post('/diagnoses/:id/reanalyze', protect, authorize('doctor'), async (req, res) => {
  try {
    const diagnosis = await Diagnosis.findById(req.params.id);
    if (!diagnosis) {
      return res.status(404).json({ message: '진단을 찾을 수 없습니다.' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent';

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ message: 'AI 서비스가 설정되지 않았습니다.' });
    }

    const axios = require('axios');
    const { symptoms, bodyParts, skinSymptoms, skinFeatures, treatmentType, duration } = diagnosis;

    const detailedInfo = `
진료 종류: ${treatmentType || '미지정'}
부위: ${bodyParts || '미지정'}
피부 증상: ${skinSymptoms || '미지정'}
기간: ${duration || '미지정'}
피부 질환 특징: ${skinFeatures || '미지정'}
증상 설명: ${symptoms}`;

    let gptDiagnosis = '';
    let medicalPapers = [];

    try {
      // AI 진단 재분석
      const diagnosisResponse = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: `당신은 피부과 전문의입니다. 환자의 피부 증상을 바탕으로 가능한 진단명을 제시하고, 관련 의학 정보를 제공해주세요. 이것은 참고용이며 정확한 진단은 피부과 전문의와 상담이 필요함을 명시하세요.\n${detailedInfo}\n\n위 정보를 바탕으로 가능한 피부과 진단명과 설명을 제공해주세요.`
            }]
          }]
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      gptDiagnosis = diagnosisResponse.data.candidates[0].content.parts[0].text;

      // 의학 논문 재검색
      const papersResponse = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: `관련 피부과 논문 3개의 제목, URL, 간단한 요약을 JSON 배열 형식으로 제공해주세요.\n형식: [{"title": "논문 제목", "url": "https://pubmed.ncbi.nlm.nih.gov/...", "summary": "요약"}]\n\n주의사항:\n- url은 실제 접근 가능한 PubMed 또는 학술 논문 링크를 제공해주세요\n- 링크가 없으면 null로 설정해주세요\n\n다음 피부 증상과 관련된 논문: ${skinSymptoms || bodyParts || '피부 질환'} - ${symptoms}`
            }]
          }]
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      try {
        const papersText = papersResponse.data.candidates[0].content.parts[0].text;
        const jsonMatch = papersText.match(/\[.*\]/s);
        if (jsonMatch) {
          medicalPapers = JSON.parse(jsonMatch[0]);
        } else {
          medicalPapers = [{ title: '관련 논문 정보', summary: papersText }];
        }
      } catch (e) {
        medicalPapers = [{ title: '관련 논문 정보', summary: papersResponse.data.candidates[0].content.parts[0].text }];
      }
    } catch (apiError) {
      console.error('재분석 Gemini API 오류:', apiError.response?.data || apiError.message);
      return res.status(500).json({ message: 'AI 재분석 중 오류가 발생했습니다.' });
    }

    // DB 업데이트: AI 진단 결과 저장, 기존 논문 삭제 후 새 논문 저장
    await Diagnosis.updateGptDiagnosis(req.params.id, gptDiagnosis);
    await Diagnosis.deletePapers(req.params.id);
    for (const paper of medicalPapers) {
      await Diagnosis.addPaper(req.params.id, paper);
    }

    const updatedDiagnosis = await Diagnosis.findById(req.params.id);
    res.json({ message: 'AI 재분석이 완료되었습니다.', diagnosis: updatedDiagnosis });
  } catch (error) {
    console.error('재분석 오류:', error);
    res.status(500).json({ message: '재분석 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
