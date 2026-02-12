const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const Diagnosis = require('../models/Diagnosis');
const { protect } = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Gemini API 설정
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent';

// Cloudinary 설정
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('Cloudinary 설정 확인:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '✅ set' : '❌ missing',
  api_key: process.env.CLOUDINARY_API_KEY ? '✅ set' : '❌ missing',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '✅ set' : '❌ missing'
});

// Cloudinary Storage 설정
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'medical-diagnosis',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }]
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// 진단 요청 생성
router.post('/', protect, upload.array('images', 5), async (req, res) => {
  try {
    console.log('===== 진단 요청 시작 =====');
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    console.log('Files count:', req.files ? req.files.length : 0);
    
    const { patient_name, symptom_type, skin_type, symptoms } = req.body;
    const images = req.files ? req.files.map(file => {
      console.log('Image uploaded:', file.path);
      return file.path;
    }) : [];
    
    console.log('Processed images:', images);

    if (!patient_name || !symptom_type || !skin_type || !symptoms) {
      return res.status(400).json({ message: '모든 필수 정보를 입력해주세요.' });
    }

    let gptDiagnosis = '';
    let medicalPapers = [];

    // Gemini API 호출 (API 키가 있는 경우에만)
    if (GEMINI_API_KEY) {
      try {
        // 진단 요청
        const diagnosisResponse = await axios.post(
          `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
          {
            contents: [{
              parts: [{
                text: `당신은 피부과 전문의입니다. 환자의 피부 증상을 바탕으로 가능한 진단명을 제시하고, 관련 의학 정보를 제공해주세요. 이것은 참고용이며 정확한 진단은 피부과 전문의와 상담이 필요함을 명시하세요.\n\n증상 종류: ${symptom_type}\n피부 타입: ${skin_type}\n증상 설명: ${symptoms}\n\n위 정보를 바탕으로 가능한 피부과 진단명과 설명을 제공해주세요.`
              }]
            }]
          },
          {
            headers: { 'Content-Type': 'application/json' }
          }
        );

        gptDiagnosis = diagnosisResponse.data.candidates[0].content.parts[0].text;

        // 의학 논문 검색
        const papersResponse = await axios.post(
          `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
          {
            contents: [{
              parts: [{
                text: `관련 피부과 논문 3개의 제목과 간단한 요약을 JSON 배열 형식으로 제공해주세요. 형식: [{"title": "논문 제목", "summary": "요약"}]\n\n다음 피부 증상과 관련된 논문: ${symptom_type} - ${symptoms}`
              }]
            }]
          },
          {
            headers: { 'Content-Type': 'application/json' }
          }
        );

        try {
          const papersText = papersResponse.data.candidates[0].content.parts[0].text;
          // JSON 추출 (코드 블록 제거)
          const jsonMatch = papersText.match(/\[.*\]/s);
          if (jsonMatch) {
            medicalPapers = JSON.parse(jsonMatch[0]);
          } else {
            medicalPapers = [{
              title: "관련 논문 정보",
              summary: papersText
            }];
          }
        } catch (e) {
          medicalPapers = [{
            title: "관련 논문 정보",
            summary: papersResponse.data.candidates[0].content.parts[0].text
          }];
        }
      } catch (apiError) {
        console.error('Gemini API 오류:', apiError.response?.data || apiError.message);
        gptDiagnosis = 'AI 진단 서비스가 일시적으로 사용 불가능합니다. 의사 검토를 기다려주세요.';
      }
    } else {
      gptDiagnosis = 'Gemini API 키가 설정되지 않았습니다. 의사 검토를 기다려주세요.';
    }

    // DB에 저장
    const diagnosis = await Diagnosis.create({
      patient_id: req.user.id,
      patient_name,
      symptom_type,
      skin_type,
      symptoms,
      gpt_diagnosis: gptDiagnosis,
      status: 'pending'
    });

    // 이미지 저장
    for (const imagePath of images) {
      await Diagnosis.addImage(diagnosis.id, imagePath);
    }

    // 논문 저장
    for (const paper of medicalPapers) {
      await Diagnosis.addPaper(diagnosis.id, paper);
    }

    // 전체 데이터 조회
    const fullDiagnosis = await Diagnosis.findById(diagnosis.id);

    res.status(201).json({
      message: '진단 요청이 생성되었습니다.',
      diagnosis: {
        ...fullDiagnosis,
        _id: fullDiagnosis.id
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '진단 요청 중 오류가 발생했습니다.', error: error.message });
  }
});

// 내 진단 목록 조회
router.get('/my', protect, async (req, res) => {
  try {
    const diagnoses = await Diagnosis.findByPatientId(req.user.id);
    res.json(diagnoses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '진단 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 특정 진단 조회
router.get('/:id', protect, async (req, res) => {
  try {
    const diagnosis = await Diagnosis.findById(req.params.id);

    if (!diagnosis) {
      return res.status(404).json({ message: '진단을 찾을 수 없습니다.' });
    }

    // 환자 본인이거나 의사인 경우만 조회 가능
    if (diagnosis.patient_id !== req.user.id && req.user.role !== 'doctor') {
      return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }

    // findById에서 이미 camelCase 변환됨
    res.json(diagnosis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '진단 조회 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
