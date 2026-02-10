import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './NewDiagnosis.css';

function NewDiagnosis() {
  const [symptoms, setSymptoms] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    
    if (!symptoms.trim()) {
      setError('증상을 입력해주세요.');
      return;
    }

    setError('');
    setLoading(true);

    const formData = new FormData();
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
        <h2>새 진단 요청</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>증상 설명 *</label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="현재 겪고 있는 증상을 자세히 설명해주세요..."
              rows="8"
              required
            />
          </div>

          <div className="form-group">
            <label>관련 이미지 (선택사항, 최대 5개)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              disabled={images.length >= 5}
            />
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
              {loading ? 'AI 분석 중...' : '진단 요청'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewDiagnosis;
