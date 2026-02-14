import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './NewDiagnosis.css';

function NewDiagnosis() {
  const [patientName, setPatientName] = useState('');
  const [patientRegistrationNumber, setPatientRegistrationNumber] = useState('');
  const [gender, setGender] = useState('male');
  const [treatmentType, setTreatmentType] = useState([]);
  const [bodyParts, setBodyParts] = useState([]);
  const [skinSymptoms, setSkinSymptoms] = useState([]);
  const [painVas, setPainVas] = useState(0);
  const [duration, setDuration] = useState('');
  const [skinFeatures, setSkinFeatures] = useState([]);
  const [symptoms, setSymptoms] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [analyzeImages, setAnalyzeImages] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 진료 종류
  const treatmentTypes = ['보험진료', '색소진료', '부작용 진료'];

  // 부위
  const bodyPartsList = ['얼굴', '목', '가슴', '배', '등', '팔', '다리', '손', '발'];

  // 피부 증상
  const skinSymptomsList = [
    { value: 'fever', label: 'fever (열)' },
    { value: 'cough', label: 'cough (기침)' },
    { value: 'itching', label: 'itching (가려움)' },
    { value: 'burning', label: 'burning (열감)' }
  ];

  // 기간
  const durationOptions = ['1일', '2~5일', '1주일이상', '1달 이상'];

  // 피부 질환 특징
  const skinFeaturesList = ['군집', '수포', '과녁모양', '인설', '발적', '검은색', '갈색'];

  const handleCheckboxChange = (value, array, setter) => {
    if (array.includes(value)) {
      setter(array.filter(item => item !== value));
    } else {
      setter([...array, value]);
    }
  };



  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 5) {
      setError('최대 5개의 이미지만 업로드할 수 있습니다.');
      return;
    }

    setImages([...images, ...files]);

    // 미리보기 생성
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    // 메모리 누수 방지
    URL.revokeObjectURL(previews[index]);
    
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!patientName.trim() || !symptoms.trim()) {
      setError('환자 이름과 증상 설명은 필수입니다.');
      return;
    }

    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('patient_name', patientName);
    formData.append('patient_registration_number', patientRegistrationNumber);
    formData.append('gender', gender);
    formData.append('treatment_type', treatmentType.join(', '));
    formData.append('body_parts', bodyParts.join(', '));
    formData.append('skin_symptoms', skinSymptoms.join(', '));
    formData.append('pain_vas', painVas);
    formData.append('duration', duration);
    formData.append('skin_features', skinFeatures.join(', '));
    formData.append('symptoms', symptoms);
    formData.append('analyze_images', analyzeImages);
    images.forEach(image => {
      formData.append('images', image);
    });

    try {
      const response = await api.post('/diagnoses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      navigate(`/diagnosis/${response.data.diagnosis._id}`);
    } catch (err) {
      setError(err.response?.data?.message || '진단 요청에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container new-diagnosis">
      <div className="card">
        <h2>환자 진단 등록</h2>
        <form onSubmit={handleSubmit}>
          {/* 환자 정보 */}
          <h3 className="section-title">환자 정보</h3>
          
          <div className="form-group">
            <label>환자 이름 *</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="환자 이름을 입력하세요"
              required
            />
          </div>

          <div className="form-group">
            <label>환자 등록번호</label>
            <input
              type="text"
              value={patientRegistrationNumber}
              onChange={(e) => setPatientRegistrationNumber(e.target.value)}
              placeholder="환자 등록번호 (선택사항)"
            />
          </div>

          <div className="form-group">
            <label>성별 *</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="male"
                  checked={gender === 'male'}
                  onChange={(e) => setGender(e.target.value)}
                />
                남성
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="female"
                  checked={gender === 'female'}
                  onChange={(e) => setGender(e.target.value)}
                />
                여성
              </label>
            </div>
          </div>

          {/* 진료 정보 */}
          <h3 className="section-title">진료 정보</h3>

          <div className="form-group">
            <label>진료 종류</label>
            <div className="checkbox-group">
              {treatmentTypes.map(type => (
                <label key={type} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={treatmentType.includes(type)}
                    onChange={() => handleCheckboxChange(type, treatmentType, setTreatmentType)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* 부위 */}
          <h3 className="section-title">부위</h3>

          <div className="form-group">
            <div className="checkbox-grid">
              {bodyPartsList.map(part => (
                <label key={part} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={bodyParts.includes(part)}
                    onChange={() => handleCheckboxChange(part, bodyParts, setBodyParts)}
                  />
                  {part}
                </label>
              ))}
            </div>
          </div>

          {/* 피부 증상 */}
          <h3 className="section-title">피부 증상</h3>

          <div className="form-group">
            <div className="checkbox-group">
              {skinSymptomsList.map(symptom => (
                <label key={symptom.value} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={skinSymptoms.includes(symptom.value)}
                    onChange={() => handleCheckboxChange(symptom.value, skinSymptoms, setSkinSymptoms)}
                  />
                  {symptom.label}
                </label>
              ))}
            </div>
          </div>

          {/* 통증 */}
          <h3 className="section-title">통증 정도 (VAS)</h3>

          <div className="form-group">
            <label>통증 점수: {painVas}/10</label>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={painVas}
              onChange={(e) => setPainVas(parseInt(e.target.value))}
              className="pain-slider"
            />
            <div className="pain-labels">
              <span>통증 없음 (0)</span>
              <span>최고 통증 (10)</span>
            </div>
          </div>

          {/* 기간 */}
          <h3 className="section-title">증상 기간</h3>

          <div className="form-group">
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option value="">선택해주세요</option>
              {durationOptions.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* 피부 질환 특징 */}
          <h3 className="section-title">피부 질환 특징</h3>

          <div className="form-group">
            <div className="checkbox-grid">
              {skinFeaturesList.map(feature => (
                <label key={feature} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={skinFeatures.includes(feature)}
                    onChange={() => handleCheckboxChange(feature, skinFeatures, setSkinFeatures)}
                  />
                  {feature}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>증상 설명 *</label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="환자의 피부 증상을 자세히 설명해주세요. 예: 언제부터 시작되었는지, 위치, 가려움증 여부 등"
              rows="8"
              required
            />
          </div>

          <div className="form-group">
            <label>피부 사진 (선택사항, 최대 5개)</label>
            <div className="image-upload-container">
              <input
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                onChange={handleImageChange}
                disabled={images.length >= 5}
                className="file-input"
                id="imageUpload"
              />
              <label htmlFor="imageUpload" className={`file-label ${images.length >= 5 ? 'disabled' : ''}`}>
                <span className="icon">📷</span>
                <span className="text">사진 선택 / 촬영</span>
                <span className="hint">최대 5개까지 가능</span>
              </label>
            </div>
          </div>

          {previews.length > 0 && (
            <div className="image-previews">
              {previews.map((preview, index) => (
                <div key={index} className="preview-item">
                  <img src={preview} alt={`미리보기 ${index + 1}`} />
                  <button 
                    type="button" 
                    onClick={() => removeImage(index)}
                    className="remove-btn"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {images.length > 0 && (
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={analyzeImages}
                  onChange={(e) => setAnalyzeImages(e.target.checked)}
                />
                <span>✨ AI 이미지 분석 포함 (Gemini Vision)</span>
              </label>
              <p className="hint-text">
                {analyzeImages 
                  ? '이미지를 AI가 분석하여 더 정확한 진단을 제공합니다. (최대 3개)' 
                  : '이미지는 의사 검토용으로만 저장됩니다.'}
              </p>
            </div>
          )}

          {error && <div className="error">{error}</div>}

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
            >
              취소
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? 'AI 분석 중...' : '진단 등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewDiagnosis;
