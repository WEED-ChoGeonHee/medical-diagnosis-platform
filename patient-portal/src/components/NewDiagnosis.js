import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './NewDiagnosis.css';

function NewDiagnosis() {
  const [patientName, setPatientName] = useState('');
  const [symptomType, setSymptomType] = useState('');
  const [skinType, setSkinType] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 피부과 증상 종류
  const symptomTypes = [
    '여드름/뾰루지',
    '아토피/습진',
    '건선',
    '두드러기',
    '사마귀',
    '무좀',
    '백반/색소침착',
    '탈모',
    '피부염/발진',
    '기타'
  ];

  // 피부 타입
  const skinTypes = [
    '지성',
    '건성',
    '복합성',
    '민감성',
    '정상'
  ];



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
    
    if (!patientName.trim() || !symptomType || !skinType || !symptoms.trim()) {
      setError('모든 필수 정보를 입력해주세요.');
      return;
    }

    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('patient_name', patientName);
    formData.append('symptom_type', symptomType);
    formData.append('skin_type', skinType);
    formData.append('symptoms', symptoms);
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
            <label>증상 종류 *</label>
            <select
              value={symptomType}
              onChange={(e) => setSymptomType(e.target.value)}
              required
            >
              <option value="">선택해주세요</option>
              {symptomTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>피부 타입 *</label>
            <select
              value={skinType}
              onChange={(e) => setSkinType(e.target.value)}
              required
            >
              <option value="">선택해주세요</option>
              {skinTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
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
