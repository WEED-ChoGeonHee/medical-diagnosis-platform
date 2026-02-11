import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import './DiagnosisDetail.css';

function DiagnosisDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState(null);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDiagnosis();
  }, [id]);

  const fetchDiagnosis = async () => {
    try {
      const response = await api.get(`/diagnoses/${id}`);
      setDiagnosis(response.data);
      setDoctorNotes(response.data.doctorNotes || '');
    } catch (err) {
      setError('진단 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async (status) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.put(`/admin/diagnoses/${id}`, {
        doctorNotes,
        status
      });
      
      setDiagnosis(response.data.diagnosis);
      setSuccess('의사 소견이 저장되었습니다.');
    } catch (err) {
      setError('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

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

  if (!diagnosis) {
    return (
      <div className="container">
        <div className="error">진단을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="container diagnosis-detail">
      <button onClick={() => navigate('/diagnoses')} className="btn btn-secondary back-btn">
        ← 목록으로
      </button>

      <div className="detail-grid">
        <div className="main-content">
          <div className="card">
            <div className="detail-header">
              <h2>피부과 진단 상세 정보</h2>
              <span className={`status-badge status-${diagnosis.status}`}>
                {getStatusText(diagnosis.status)}
              </span>
            </div>

            <div className="patient-info">
              <h3>환자 정보</h3>
              <p><strong>이름:</strong> {diagnosis.patient?.name}</p>
              <p><strong>이메일:</strong> {diagnosis.patient?.email}</p>
              <p><strong>전화번호:</strong> {diagnosis.patient?.phone || '-'}</p>
            </div>

            <div className="detail-section">
              <h3>진단 정보</h3>
              <div className="info-grid">
                <p><strong>증상 종류:</strong> {diagnosis.symptom_type}</p>
                <p><strong>피부 타입:</strong> {diagnosis.skin_type}</p>
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
                      <p>{paper.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="sidebar">
          <div className="card">
            <h3>의사 소견</h3>
            <textarea
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              placeholder="환자에 대한 소견을 작성하세요..."
              rows="10"
            />
            
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}

            <div className="action-buttons">
              <button 
                onClick={() => handleSaveNotes('reviewed')}
                className="btn btn-success"
                disabled={saving}
              >
                {saving ? '저장 중...' : '검토 완료'}
              </button>
              <button 
                onClick={() => handleSaveNotes('completed')}
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? '저장 중...' : '완료 처리'}
              </button>
            </div>

            <div className="meta-info">
              <p><strong>작성일:</strong><br/>{new Date(diagnosis.createdAt).toLocaleString('ko-KR')}</p>
              {diagnosis.updatedAt !== diagnosis.createdAt && (
                <p><strong>수정일:</strong><br/>{new Date(diagnosis.updatedAt).toLocaleString('ko-KR')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiagnosisDetail;
