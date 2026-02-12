import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import './DiagnosisDetail.css';

function DiagnosisDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const response = await api.get(`/diagnoses/${id}`);
        setDiagnosis(response.data);
      } catch (err) {
        setError('진단 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDiagnosis();
  }, [id]);

  const getStatusText = (status) => {
    const statusMap = {
      'pending': '대기 중',
      'reviewed': '검토 완료',
      'completed': '완료'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return <div className="container loading">로딩 중...</div>;
  }

  if (error || !diagnosis) {
    return (
      <div className="container">
        <div className="error">{error}</div>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="container diagnosis-detail">
      <button onClick={() => navigate('/dashboard')} className="btn btn-secondary back-btn">
        ← 돌아가기
      </button>

      <div className="card">
        <div className="detail-header">
          <h2>피부과 진단 상세 정보</h2>
          <span className={`status-badge status-${diagnosis.status}`}>
            {getStatusText(diagnosis.status)}
          </span>
        </div>

        <div className="detail-section">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">증상 종류</span>
              <span className="info-value">{diagnosis.symptom_type}</span>
            </div>
            <div className="info-item">
              <span className="info-label">피부 타입</span>
              <span className="info-value">{diagnosis.skin_type}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>증상 설명</h3>
          <p>{diagnosis.symptoms}</p>
        </div>

        {diagnosis.images && diagnosis.images.length > 0 && (
          <div className="detail-section">
            <h3>첨부 이미지</h3>
            <div className="image-gallery">
              {diagnosis.images.map((image, index) => (
                <img 
                  key={index} 
                  src={image.image_path || image} 
                  alt={`진단 이미지 ${index + 1}`}
                  onError={(e) => {
                    console.error('이미지 로드 실패:', image);
                    e.target.style.display = 'none';
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {diagnosis.gptDiagnosis && (
          <div className="detail-section gpt-section">
            <h3>AI 진단 결과</h3>
            <div className="gpt-content">
              {diagnosis.gptDiagnosis.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        )}

        {diagnosis.medicalPapers && diagnosis.medicalPapers.length > 0 && (
          <div className="detail-section">
            <h3>관련 의학 정보</h3>
            <div className="papers-list">
              {diagnosis.medicalPapers.map((paper, index) => (
                <div key={index} className="paper-item">
                  <h4>{paper.title}</h4>
                  {paper.url && (
                    <p>
                      <strong>논문 링크:</strong>{' '}
                      <a href={paper.url} target="_blank" rel="noopener noreferrer">
                        {paper.url}
                      </a>
                    </p>
                  )}
                  <p>{paper.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {diagnosis.doctorNotes && (
          <div className="detail-section doctor-section">
            <h3>의사 소견</h3>
            <p>{diagnosis.doctorNotes}</p>
          </div>
        )}

        <div className="detail-footer">
          <small>작성일: {new Date(diagnosis.createdAt).toLocaleString('ko-KR')}</small>
          {diagnosis.updatedAt !== diagnosis.createdAt && (
            <small>수정일: {new Date(diagnosis.updatedAt).toLocaleString('ko-KR')}</small>
          )}
        </div>
      </div>
    </div>
  );
}

export default DiagnosisDetail;
