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
  const [patientHistory, setPatientHistory] = useState([]);
  const [dermatologyInfo, setDermatologyInfo] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showDermatologyModal, setShowDermatologyModal] = useState(false);

  useEffect(() => {
    fetchDiagnosis();
  }, [id]);

  const fetchDiagnosis = async () => {
    try {
      const response = await api.get(`/diagnoses/${id}`);
      setDiagnosis(response.data);
      setDoctorNotes(response.data.doctorNotes || '');
      
      // 환자 등록번호가 있으면 히스토리 로드
      if (response.data.patientRegistrationNumber) {
        fetchPatientHistory(response.data.patientRegistrationNumber);
      }
    } catch (err) {
      setError('진단 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientHistory = async (registrationNumber) => {
    try {
      const response = await api.get(`/admin/patient-history/${registrationNumber}`);
      setPatientHistory(response.data);
    } catch (err) {
      console.error('히스토리 조회 오류:', err);
    }
  };

  const searchDermatologyDiagnosis = async () => {
    if (!searchTerm.trim()) {
      setError('검색어를 입력해주세요.');
      return;
    }
    
    try {
      const response = await api.get(`/admin/dermatology-diagnoses/search?q=${encodeURIComponent(searchTerm)}`);
      setDermatologyInfo(response.data);
      setShowDermatologyModal(true);
      setError('');
    } catch (err) {
      setError('진단 정보 검색에 실패했습니다.');
      setDermatologyInfo([]);
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
      setSuccess(`의사 소견이 저장되었습니다. (상태: ${getStatusText(status)})`);
    } catch (err) {
      console.error('의사 소견 저장 오류:', err);
      setError(err.response?.data?.message || '저장에 실패했습니다.');
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
              {diagnosis.patientRegistrationNumber && (
                <p>
                  <strong>환자 등록번호:</strong> {diagnosis.patientRegistrationNumber}
                  <button 
                    onClick={() => setShowHistoryModal(true)} 
                    className="btn btn-secondary btn-sm"
                    style={{ marginLeft: '10px' }}
                  >
                    진료 히스토리 보기
                  </button>
                </p>
              )}
              <p><strong>성별:</strong> {diagnosis.gender === 'male' ? '남성' : '여성'}</p>
              <p><strong>이메일:</strong> {diagnosis.patient?.email}</p>
              <p><strong>전화번호:</strong> {diagnosis.patient?.phone || '-'}</p>
            </div>

            <div className="detail-section">
              <h3>진단 정보</h3>
              <div className="info-grid">
                {diagnosis.treatmentType && <p><strong>진료 종류:</strong> {diagnosis.treatmentType}</p>}
                {diagnosis.bodyParts && <p><strong>부위:</strong> {diagnosis.bodyParts}</p>}
                {diagnosis.skinSymptoms && <p><strong>피부 증상:</strong> {diagnosis.skinSymptoms}</p>}
                {diagnosis.painVas !== null && <p><strong>통증(VAS):</strong> {diagnosis.painVas}/10</p>}
                {diagnosis.duration && <p><strong>기간:</strong> {diagnosis.duration}</p>}
                {diagnosis.skinFeatures && <p><strong>피부 질환 특징:</strong> {diagnosis.skinFeatures}</p>}
              </div>
            </div>

            <div className="detail-section">
              <h3>피부과 진단 검색</h3>
              <div className="search-box">
                <input
                  type="text"
                  placeholder="진단명 검색 (건선, 종기, 아토피)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchDermatologyDiagnosis()}
                />
                <button onClick={searchDermatologyDiagnosis} className="btn btn-primary">
                  검색
                </button>
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

      {/* 환자 히스토리 모달 */}
      {showHistoryModal && (
        <div className="modal-overlay" onClick={() => setShowHistoryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>환자 진료 히스토리 (등록번호: {diagnosis.patientRegistrationNumber})</h3>
              <button onClick={() => setShowHistoryModal(false)} className="close-btn">✕</button>
            </div>
            <div className="modal-body">
              {patientHistory.length === 0 ? (
                <p>이전 진료 기록이 없습니다.</p>
              ) : (
                <div className="history-list">
                  {patientHistory.map((item) => (
                    <div key={item._id} className="history-item">
                      <div className="history-header">
                        <span className="history-date">
                          {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                        </span>
                        <span className={`status-badge status-${item.status}`}>
                          {item.status}
                        </span>
                      </div>
                      <p><strong>진료 종류:</strong> {item.treatmentType || '-'}</p>
                      <p><strong>부위:</strong> {item.bodyParts || '-'}</p>
                      <p><strong>증상:</strong> {item.symptoms.substring(0, 100)}...</p>
                      {item._id !== diagnosis._id && (
                        <button 
                          onClick={() => navigate(`/diagnosis/${item._id}`)} 
                          className="btn btn-sm btn-secondary"
                        >
                          상세 보기
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 피부과 진단 정보 모달 */}
      {showDermatologyModal && (
        <div className="modal-overlay" onClick={() => setShowDermatologyModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>피부과 진단 상세 정보</h3>
              <button onClick={() => setShowDermatologyModal(false)} className="close-btn">✕</button>
            </div>
            <div className="modal-body">
              {dermatologyInfo.length === 0 ? (
                <p>검색 결과가 없습니다.</p>
              ) : (
                <div className="dermatology-list">
                  {dermatologyInfo.map((item) => (
                    <div key={item.id} className="dermatology-item">
                      <h4>{item.diagnosis_name_kr} ({item.diagnosis_name})</h4>
                      <p><strong>ICD 코드:</strong> {item.icd_code}</p>
                      <p><strong>보험 수가 코드:</strong> {item.insurance_code}</p>
                      
                      <div className="treatment-section">
                        <h5>치료 가이드라인</h5>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{item.treatment_guideline}</p>
                      </div>
                      
                      <div className="soap-section">
                        <h5>SOAP 차팅</h5>
                        <div className="soap-grid">
                          <div className="soap-item">
                            <strong>S (Subjective):</strong>
                            <p>{item.soap_s}</p>
                          </div>
                          <div className="soap-item">
                            <strong>O (Objective):</strong>
                            <p>{item.soap_o}</p>
                          </div>
                          <div className="soap-item">
                            <strong>A (Assessment):</strong>
                            <p>{item.soap_a}</p>
                          </div>
                          <div className="soap-item">
                            <strong>P (Plan):</strong>
                            <p>{item.soap_p}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DiagnosisDetail;
