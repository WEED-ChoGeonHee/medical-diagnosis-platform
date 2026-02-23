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
  const [selectedHistoryImage, setSelectedHistoryImage] = useState(null);
  const [selectedHistoryDate, setSelectedHistoryDate] = useState(null);
  const [currentHistoryPage, setCurrentHistoryPage] = useState(0);
  const [dermatologyInfo, setDermatologyInfo] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showDermatologyModal, setShowDermatologyModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    diagnosis: true,
    search: false,
    symptoms: true,
    aiSuggestions: false
  });
  
  // AI 추천 증상 관련 상태
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [selectedAiDiagnosis, setSelectedAiDiagnosis] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    fetchDiagnosis();
  }, [id]);

  // 진단 정보가 로드되면 AI 증상 추천 자동 fetch
  useEffect(() => {
    if (diagnosis && diagnosis.symptoms) {
      fetchAiSuggestions();
    }
  }, [diagnosis]);

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

  // AI 증상 추천 fetch (상위 3개)
  const fetchAiSuggestions = async () => {
    if (!diagnosis || !diagnosis.symptoms) return;
    
    setLoadingAi(true);
    try {
      const response = await api.post('/admin/ai-suggest-symptoms', {
        symptoms: diagnosis.symptoms,
        bodyParts: diagnosis.bodyParts,
        skinSymptoms: diagnosis.skinSymptoms,
        images: diagnosis.images
      });
      setAiSuggestions(response.data.suggestions || []);
    } catch (err) {
      console.error('AI 증상 추천 오류:', err);
      setAiSuggestions([]);
    } finally {
      setLoadingAi(false);
    }
  };

  // AI 진단 정보 상세 버튼 클릭
  const handleAiDiagnosisClick = (suggestion) => {
    setSelectedAiDiagnosis(suggestion);
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
            {/* 히스토리에서 선택된 이미지와 등록일 표시 */}
            {selectedHistoryImage && (
              <div className="history-image-main">
                <img src={selectedHistoryImage} alt="히스토리 이미지" style={{maxWidth:'100%', maxHeight:'300px'}} />
                <div style={{marginTop:'8px', color:'#555'}}>
                  등록일: {selectedHistoryDate}
                </div>
              </div>
            )}
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
                </p>
              )}
              <p><strong>성별:</strong> {diagnosis.gender === 'male' ? '남성' : '여성'}</p>
              <p><strong>이메일:</strong> {diagnosis.patient?.email}</p>
              <p><strong>전화번호:</strong> {diagnosis.patient?.phone || '-'}</p>
            </div>

            {/* 진료 히스토리 이미지 슬라이더 (1장씩 가로 슬라이드) */}
            {patientHistory.length > 0 && (() => {
              const historyWithImages = patientHistory.filter(item => item.images && item.images.length > 0);
              if (historyWithImages.length === 0) return null;
              
              const safePage = Math.min(currentHistoryPage, historyWithImages.length - 1);
              const currentItem = historyWithImages[safePage];
              const currentImage = currentItem.images[0];
              
              return (
                <div className="detail-section">
                  <h3>진료 히스토리 (이미지) <span style={{fontSize:'14px', color:'#888', fontWeight:'normal'}}>총 {historyWithImages.length}개</span></h3>
                  <div className="history-slider">
                    <div className="slider-main" style={{position:'relative', width:'100%', maxWidth:'800px', margin:'0 auto'}}>
                      <div className="slider-item" style={{textAlign:'center'}}>
                        <img 
                          src={currentImage.image_path || currentImage} 
                          alt="히스토리 이미지" 
                          style={{maxWidth:'100%', maxHeight:'500px', objectFit:'contain', borderRadius:'8px', boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}
                          onError={(e) => {e.target.style.display='none';}}
                        />
                        <div style={{marginTop:'16px', padding:'12px', background:'#f9f9f9', borderRadius:'8px', display:'inline-block'}}>
                          <div style={{fontSize:'14px', color:'#667eea', fontWeight:'600'}}>
                            등록일: {new Date(currentItem.createdAt).toLocaleDateString('ko-KR')}
                          </div>
                          {currentItem.images.length > 1 && (
                            <div style={{fontSize:'12px', color:'#888', marginTop:'4px'}}>
                              📷 {currentItem.images.length}개 이미지
                            </div>
                          )}
                          {currentItem.symptoms && (
                            <div style={{fontSize:'12px', color:'#666', marginTop:'8px', maxWidth:'600px'}}>
                              {currentItem.symptoms.length > 100 ? currentItem.symptoms.substring(0, 100) + '...' : currentItem.symptoms}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {historyWithImages.length > 1 && (
                      <div className="slider-controls" style={{marginTop:'20px', display:'flex', justifyContent:'center', alignItems:'center', gap:'20px'}}>
                        <button 
                          className="btn btn-secondary"
                          onClick={() => setCurrentHistoryPage(prev => Math.max(0, prev - 1))}
                          disabled={safePage === 0}
                          style={{minWidth:'80px'}}
                        >
                          ← 이전
                        </button>
                        <span style={{display:'flex', alignItems:'center', color:'#333', fontSize:'16px', fontWeight:'600'}}>
                          {safePage + 1} / {historyWithImages.length}
                        </span>
                        <button 
                          className="btn btn-secondary"
                          onClick={() => setCurrentHistoryPage(prev => Math.min(historyWithImages.length - 1, prev + 1))}
                          disabled={safePage === historyWithImages.length - 1}
                          style={{minWidth:'80px'}}
                        >
                          다음 →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* 진단 정보 - 컴팩트 뷰 */}
            <div className="detail-section" style={{marginBottom:'12px'}}>
              <h3 
                style={{cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center'}}
                onClick={() => setExpandedSections(prev => ({...prev, diagnosis: !prev.diagnosis}))}
              >
                <span>진단 정보</span>
                <span style={{fontSize:'18px'}}>{expandedSections.diagnosis ? '▼' : '▶'}</span>
              </h3>
              {expandedSections.diagnosis && (
                <div className="info-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'12px', marginTop:'12px'}}>
                  {diagnosis.treatmentType && <div style={{padding:'8px', background:'#f5f5f5', borderRadius:'6px', color:'#333'}}><strong style={{color:'#000'}}>진료 종류:</strong> {diagnosis.treatmentType}</div>}
                  {diagnosis.bodyParts && <div style={{padding:'8px', background:'#f5f5f5', borderRadius:'6px', color:'#333'}}><strong style={{color:'#000'}}>부위:</strong> {diagnosis.bodyParts}</div>}
                  {diagnosis.skinSymptoms && <div style={{padding:'8px', background:'#f5f5f5', borderRadius:'6px', color:'#333'}}><strong style={{color:'#000'}}>피부 증상:</strong> {diagnosis.skinSymptoms}</div>}
                  {diagnosis.painVas !== null && <div style={{padding:'8px', background:'#f5f5f5', borderRadius:'6px', color:'#333'}}><strong style={{color:'#000'}}>통증(VAS):</strong> {diagnosis.painVas}/10</div>}
                  {diagnosis.duration && <div style={{padding:'8px', background:'#f5f5f5', borderRadius:'6px', color:'#333'}}><strong style={{color:'#000'}}>기간:</strong> {diagnosis.duration}</div>}
                  {diagnosis.skinFeatures && <div style={{padding:'8px', background:'#f5f5f5', borderRadius:'6px', color:'#333'}}><strong style={{color:'#000'}}>피부 질환 특징:</strong> {diagnosis.skinFeatures}</div>}
                </div>
              )}
            </div>

            {/* 증상 설명 */}
            <div className="detail-section" style={{marginBottom:'12px'}}>
              <h3 
                style={{cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center'}}
                onClick={() => setExpandedSections(prev => ({...prev, symptoms: !prev.symptoms}))}
              >
                <span>증상 설명</span>
                <span style={{fontSize:'18px'}}>{expandedSections.symptoms ? '▼' : '▶'}</span>
              </h3>
              {expandedSections.symptoms && (
                <p style={{marginTop:'12px', padding:'12px', background:'#f9f9f9', borderRadius:'8px', lineHeight:'1.6', color:'#333'}}>{diagnosis.symptoms}</p>
              )}
            </div>

            {/* 피부과 진단 검색 */}
            <div className="detail-section" style={{marginBottom:'12px'}}>
              <h3 
                style={{cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center'}}
                onClick={() => setExpandedSections(prev => ({...prev, search: !prev.search}))}
              >
                <span>피부과 진단 검색</span>
                <span style={{fontSize:'18px'}}>{expandedSections.search ? '▼' : '▶'}</span>
              </h3>
              {expandedSections.search && (
                <div className="search-box" style={{marginTop:'12px'}}>
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
              )}
            </div>

            {/* AI 추천 증상 3개 및 진단 정보 */}
            <div className="detail-section" style={{marginBottom:'12px'}}>
              <h3 
                style={{cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center'}}
                onClick={() => setExpandedSections(prev => ({...prev, aiSuggestions: !prev.aiSuggestions}))}
              >
                <span>AI 추천 진단 (상위 3개)</span>
                <span style={{fontSize:'18px'}}>{expandedSections.aiSuggestions ? '▼' : '▶'}</span>
              </h3>
              {expandedSections.aiSuggestions && (
                <div style={{marginTop:'12px'}}>
                  {loadingAi ? (
                    <p style={{color:'#aaa'}}>AI 추천 조회 중...</p>
                  ) : aiSuggestions.length === 0 ? (
                    <p style={{color:'#bbb'}}>추천 진단이 없습니다.</p>
                  ) : (
                    <div className="ai-suggestion-list">
                      {aiSuggestions.map((suggestion, idx) => (
                        <div key={idx} style={{marginBottom:'12px'}}>
                          <button
                            className="btn btn-outline-primary"
                            style={{width:'100%',textAlign:'left',display:'flex',justifyContent:'space-between',alignItems:'center'}}
                            onClick={() => handleAiDiagnosisClick(suggestion)}
                          >
                            <span>{suggestion.diagnosis}</span>
                            <span style={{fontSize:'12px',color:'#888'}}>신뢰도: {suggestion.confidence}%</span>
                          </button>
                          {selectedAiDiagnosis && selectedAiDiagnosis.diagnosis === suggestion.diagnosis && (
                            <div className="ai-diagnosis-detail" style={{marginTop:'8px',background:'#f9f9f9',padding:'12px',borderRadius:'8px',border:'1px solid #ddd'}}>
                              <p><strong>진단명:</strong> {suggestion.diagnosis}</p>
                              <p><strong>신뢰도:</strong> {suggestion.confidence}%</p>
                              <p><strong>설명:</strong> {suggestion.description}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
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
                <div className="gpt-content" style={{whiteSpace: 'pre-wrap'}}>
                  {diagnosis.gptDiagnosis}
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
              <h3>환자 진료 히스토리 (사진만 표시)</h3>
              <button 
                onClick={() => setShowHistoryModal(false)} 
                className="close-btn"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              {diagnosis.patientRegistrationNumber && (
                <p style={{ marginBottom: '20px', color: '#667eea', fontWeight: '600' }}>
                  환자 등록번호: {diagnosis.patientRegistrationNumber}
                </p>
              )}
              {patientHistory.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
                  이전 진료 기록이 없습니다.
                </p>
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
                      {/* 사진만 표시, 사진 클릭 시 상단에 표시 */}
                      {item.images && item.images.length > 0 ? (
                        <div className="history-images">
                          {item.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img.image_path || img}
                              alt="히스토리 이미지"
                              style={{width:'80px',height:'80px',objectFit:'cover',margin:'4px',cursor:'pointer'}}
                              onClick={() => {
                                setSelectedHistoryImage(img.image_path || img);
                                setSelectedHistoryDate(new Date(item.createdAt).toLocaleDateString('ko-KR'));
                                setShowHistoryModal(false);
                              }}
                              onError={(e) => {e.target.style.display='none';}}
                            />
                          ))}
                        </div>
                      ) : (
                        <div style={{color:'#bbb',textAlign:'center',padding:'16px'}}>이미지가 없습니다.</div>
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
              <button 
                onClick={() => setShowDermatologyModal(false)} 
                className="close-btn"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              {dermatologyInfo.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
                  검색 결과가 없습니다.
                </p>
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
                        <div className="soap-notes">
                          <div className="soap-item">
                            <strong>S (Subjective - 주관적 증상):</strong>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{item.soap_s}</p>
                          </div>
                          <div className="soap-item">
                            <strong>O (Objective - 객관적 소견):</strong>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{item.soap_o}</p>
                          </div>
                          <div className="soap-item">
                            <strong>A (Assessment - 진단평가):</strong>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{item.soap_a}</p>
                          </div>
                          <div className="soap-item">
                            <strong>P (Plan - 치료계획):</strong>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{item.soap_p}</p>
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
