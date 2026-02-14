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

module.exports = router;
