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
  const [lightboxSrc, setLightboxSrc] = useState(null);

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
    return (
      <div className="dd-container dd-loading">
        <div className="dd-spinner"></div>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error || !diagnosis) {
    return (
      <div className="dd-container">
        <div className="dd-error">{error || '진단을 찾을 수 없습니다.'}</div>
        <button onClick={() => navigate('/dashboard')} className="dd-back-btn">
          ← 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="dd-container">
      {/* Top Bar */}
      <div className="dd-top-bar">
        <button onClick={() => navigate('/dashboard')} className="dd-back-btn">
          ← 돌아가기
        </button>
        <div className="dd-header-info">
          <h2>피부과 진단 상세</h2>
          <span className={`dd-status-badge dd-status-${diagnosis.status}`}>
            {getStatusText(diagnosis.status)}
          </span>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="dd-two-col">

        {/* ===== Column 1 ===== */}
        <div className="dd-column">

          {/* 환자 정보 */}
          <div className="dd-panel dd-panel-patient">
            <h3><span className="dd-icon">👤</span> 환자 정보</h3>
            <div className="dd-info-rows">
              {diagnosis.patientRegistrationNumber && (
                <div className="dd-info-row">
                  <span className="dd-label">등록번호</span>
                  <span className="dd-value">{diagnosis.patientRegistrationNumber}</span>
                </div>
              )}
              <div className="dd-info-row">
                <span className="dd-label">성별</span>
                <span className="dd-value">{diagnosis.gender === 'male' ? '남성' : '여성'}</span>
              </div>
              {diagnosis.treatmentType && (
                <div className="dd-info-row">
                  <span className="dd-label">진료 종류</span>
                  <span className="dd-value">{diagnosis.treatmentType}</span>
                </div>
              )}
              {diagnosis.bodyParts && (
                <div className="dd-info-row">
                  <span className="dd-label">부위</span>
                  <span className="dd-value">{diagnosis.bodyParts}</span>
                </div>
              )}
              {diagnosis.painVas !== null && diagnosis.painVas !== undefined && (
                <div className="dd-info-row">
                  <span className="dd-label">통증(VAS)</span>
                  <span className="dd-value">{diagnosis.painVas}/10</span>
                </div>
              )}
              {diagnosis.duration && (
                <div className="dd-info-row">
                  <span className="dd-label">증상 기간</span>
                  <span className="dd-value">{diagnosis.duration}</span>
                </div>
              )}
              <div className="dd-info-row">
                <span className="dd-label">접수일</span>
                <span className="dd-value">{new Date(diagnosis.createdAt).toLocaleDateString('ko-KR')}</span>
              </div>
            </div>
          </div>

          {/* 첨부 사진 */}
          {diagnosis.images && diagnosis.images.length > 0 && (
            <div className="dd-panel">
              <h3><span className="dd-icon">📷</span> 첨부 사진</h3>
              <div className="dd-images">
                {diagnosis.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.image_path || image}
                    alt={`진단 이미지 ${index + 1}`}
                    className="dd-photo"
                    onClick={() => setLightboxSrc(image.image_path || image)}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 증상 */}
          <div className="dd-panel">
            <h3><span className="dd-icon">🩺</span> 증상 정보</h3>
            <div className="dd-symptom-tags">
              {diagnosis.skinSymptoms && (
                <span className="dd-tag dd-tag-skin">{diagnosis.skinSymptoms}</span>
              )}
              {diagnosis.skinFeatures && (
                <span className="dd-tag dd-tag-feature">{diagnosis.skinFeatures}</span>
              )}
            </div>
            {diagnosis.symptoms && (
              <div className="dd-symptom-desc">
                <strong>증상 설명</strong>
                <p>{diagnosis.symptoms}</p>
              </div>
            )}
          </div>

        </div>

        {/* ===== Column 2 ===== */}
        <div className="dd-column">

          {/* AI 진단 결과 */}
          {diagnosis.gptDiagnosis && (
            <div className="dd-panel dd-panel-ai">
              <h3><span className="dd-icon">🤖</span> AI 진단 결과</h3>
              <div className="dd-gpt-content">
                {diagnosis.gptDiagnosis.split('\n').map((line, index) => (
                  line.trim() ? <p key={index}>{line}</p> : null
                ))}
              </div>
            </div>
          )}

          {/* 관련 의학 정보 */}
          {diagnosis.medicalPapers && diagnosis.medicalPapers.length > 0 && (
            <div className="dd-panel">
              <h3><span className="dd-icon">📄</span> 관련 의학 정보</h3>
              <div className="dd-papers">
                {diagnosis.medicalPapers.map((paper, index) => (
                  <div key={index} className="dd-paper-item">
                    <h4>{paper.title}</h4>
                    {paper.url && (
                      <a href={paper.url} target="_blank" rel="noopener noreferrer" className="dd-paper-link">
                        논문 바로가기 →
                      </a>
                    )}
                    {paper.summary && <p>{paper.summary}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 의사 소견 */}
          {diagnosis.doctorNotes && (
            <div className="dd-panel dd-panel-doctor">
              <h3><span className="dd-icon">👨‍⚕️</span> 의사 소견</h3>
              <div className="dd-doctor-notes">
                {diagnosis.doctorNotes.split('\n').map((line, index) => (
                  line.trim() ? <p key={index}>{line}</p> : null
                ))}
              </div>
            </div>
          )}

          {/* 날짜 정보 */}
          <div className="dd-panel dd-panel-meta">
            <h3><span className="dd-icon">📅</span> 일정 정보</h3>
            <div className="dd-info-rows">
              <div className="dd-info-row">
                <span className="dd-label">접수일</span>
                <span className="dd-value">{new Date(diagnosis.createdAt).toLocaleString('ko-KR')}</span>
              </div>
              {diagnosis.updatedAt !== diagnosis.createdAt && (
                <div className="dd-info-row">
                  <span className="dd-label">수정일</span>
                  <span className="dd-value">{new Date(diagnosis.updatedAt).toLocaleString('ko-KR')}</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <div className="dd-lightbox-overlay" onClick={() => setLightboxSrc(null)}>
          <button className="dd-lightbox-close" onClick={() => setLightboxSrc(null)}>✕</button>
          <div className="dd-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxSrc} alt="확대 이미지" className="dd-lightbox-img" />
          </div>
        </div>
      )}
    </div>
  );
}

export default DiagnosisDetail;
