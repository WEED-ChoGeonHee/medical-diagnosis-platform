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
  const [savingChart, setSavingChart] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [chartSuccess, setChartSuccess] = useState('');
  const [patientHistory, setPatientHistory] = useState([]);
  const [currentHistoryPage, setCurrentHistoryPage] = useState(0);

  // AI 추천 증상 관련 상태
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [selectedAiDiagnosis, setSelectedAiDiagnosis] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // 차팅 관련 상태
  const [chartData, setChartData] = useState({
    chartDiagnosisName: '',
    chartIcdCode: '',
    chartInsuranceCode: '',
    chartTreatmentGuideline: '',
    chartSoapS: '',
    chartSoapO: '',
    chartSoapA: '',
    chartSoapP: ''
  });

  useEffect(() => {
    fetchDiagnosis();
  }, [id]);

  // 진단 정보가 로드되면 AI 증상 추천 자동 fetch
  useEffect(() => {
    if (diagnosis && diagnosis.symptoms) {
      fetchAiSuggestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagnosis?.id]);

  const fetchDiagnosis = async () => {
    try {
      const response = await api.get(`/diagnoses/${id}`);
      const data = response.data;
      setDiagnosis(data);
      setDoctorNotes(data.doctorNotes || '');
      
      // 차팅 데이터 초기화
      setChartData({
        chartDiagnosisName: data.chartDiagnosisName || '',
        chartIcdCode: data.chartIcdCode || '',
        chartInsuranceCode: data.chartInsuranceCode || '',
        chartTreatmentGuideline: data.chartTreatmentGuideline || '',
        chartSoapS: data.chartSoapS || '',
        chartSoapO: data.chartSoapO || '',
        chartSoapA: data.chartSoapA || '',
        chartSoapP: data.chartSoapP || ''
      });

      // 환자 등록번호가 있으면 히스토리 로드
      if (data.patientRegistrationNumber) {
        fetchPatientHistory(data.patientRegistrationNumber);
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

  // AI 진단 클릭 시 → 피부과 진단 DB에서 검색하여 차팅 자동입력
  const handleAiDiagnosisClick = async (suggestion) => {
    setSelectedAiDiagnosis(suggestion);
    
    try {
      const response = await api.get(`/admin/dermatology-diagnoses/search?q=${encodeURIComponent(suggestion.diagnosis)}`);
      if (response.data && response.data.length > 0) {
        const info = response.data[0];
        setChartData({
          chartDiagnosisName: info.diagnosis_name_kr + ' (' + info.diagnosis_name + ')',
          chartIcdCode: info.icd_code || '',
          chartInsuranceCode: info.insurance_code || '',
          chartTreatmentGuideline: info.treatment_guideline || '',
          chartSoapS: info.soap_s || '',
          chartSoapO: info.soap_o || '',
          chartSoapA: info.soap_a || '',
          chartSoapP: info.soap_p || ''
        });
      } else {
        // DB에 없으면 AI 정보로 일부 채움
        setChartData(prev => ({
          ...prev,
          chartDiagnosisName: suggestion.diagnosis,
          chartSoapA: `진단: ${suggestion.diagnosis} (신뢰도: ${suggestion.confidence}%)\n${suggestion.description}`
        }));
      }
    } catch (err) {
      // 검색 실패시에도 진단명 채움
      setChartData(prev => ({
        ...prev,
        chartDiagnosisName: suggestion.diagnosis
      }));
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
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('의사 소견 저장 오류:', err);
      setError(err.response?.data?.message || '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCharting = async () => {
    setSavingChart(true);
    setChartSuccess('');

    try {
      const response = await api.put(`/admin/diagnoses/${id}/charting`, chartData);
      setDiagnosis(response.data.diagnosis);
      setChartSuccess('차팅 정보가 저장되었습니다.');
      setTimeout(() => setChartSuccess(''), 3000);
    } catch (err) {
      console.error('차팅 저장 오류:', err);
      setError(err.response?.data?.message || '차팅 저장에 실패했습니다.');
    } finally {
      setSavingChart(false);
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

  const handleChartChange = (field, value) => {
    setChartData(prev => ({ ...prev, [field]: value }));
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

  const HISTORY_PER_PAGE = 3;
  const historyTotalPages = Math.ceil(patientHistory.length / HISTORY_PER_PAGE);
  const safeHistoryPage = Math.min(currentHistoryPage, Math.max(historyTotalPages - 1, 0));
  const historyPageItems = patientHistory.slice(
    safeHistoryPage * HISTORY_PER_PAGE,
    (safeHistoryPage + 1) * HISTORY_PER_PAGE
  );

  return (
    <div className="container diagnosis-detail">
      <div className="detail-top-bar">
        <button onClick={() => navigate('/diagnoses')} className="btn btn-secondary back-btn">
          ← 목록으로
        </button>
        <div className="detail-header-info">
          <h2>피부과 진단 상세</h2>
          <span className={`status-badge status-${diagnosis.status}`}>
            {getStatusText(diagnosis.status)}
          </span>
        </div>
      </div>

      {/* === 3-Column Layout === */}
      <div className="three-column-grid">

        {/* ============ Column 1: 환자 정보 ============ */}
        <div className="column column-left">
          {/* 환자 기본 정보 */}
          <div className="panel patient-panel">
            <h3><span className="panel-icon">👤</span> 환자 정보</h3>
            <div className="patient-info-rows">
              <div className="info-row">
                <span className="info-label">이름</span>
                <span className="info-value">{diagnosis.patient?.name}</span>
              </div>
              {diagnosis.patientRegistrationNumber && (
                <div className="info-row">
                  <span className="info-label">등록번호</span>
                  <span className="info-value">{diagnosis.patientRegistrationNumber}</span>
                </div>
              )}
              <div className="info-row">
                <span className="info-label">성별</span>
                <span className="info-value">{diagnosis.gender === 'male' ? '남성' : '여성'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">이메일</span>
                <span className="info-value">{diagnosis.patient?.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">전화번호</span>
                <span className="info-value">{diagnosis.patient?.phone || '-'}</span>
              </div>
              {diagnosis.treatmentType && (
                <div className="info-row">
                  <span className="info-label">진료 종류</span>
                  <span className="info-value">{diagnosis.treatmentType}</span>
                </div>
              )}
              {diagnosis.bodyParts && (
                <div className="info-row">
                  <span className="info-label">부위</span>
                  <span className="info-value">{diagnosis.bodyParts}</span>
                </div>
              )}
              {diagnosis.painVas !== null && diagnosis.painVas !== undefined && (
                <div className="info-row">
                  <span className="info-label">통증(VAS)</span>
                  <span className="info-value">{diagnosis.painVas}/10</span>
                </div>
              )}
              {diagnosis.duration && (
                <div className="info-row">
                  <span className="info-label">기간</span>
                  <span className="info-value">{diagnosis.duration}</span>
                </div>
              )}
            </div>
          </div>

          {/* 환자 사진 (첨부 이미지) */}
          {diagnosis.images && diagnosis.images.length > 0 && (
            <div className="panel">
              <h3><span className="panel-icon">📷</span> 환자 사진</h3>
              <div className="patient-images">
                {diagnosis.images.map((image, index) => (
                  <img 
                    key={index} 
                    src={image.image_path || image} 
                    alt={`진단 이미지 ${index + 1}`}
                    className="patient-photo"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 선택된 증상 */}
          <div className="panel">
            <h3><span className="panel-icon">🩺</span> 선택된 증상</h3>
            <div className="symptom-tags">
              {diagnosis.skinSymptoms && (
                <div className="symptom-tag skin">{diagnosis.skinSymptoms}</div>
              )}
              {diagnosis.skinFeatures && (
                <div className="symptom-tag feature">{diagnosis.skinFeatures}</div>
              )}
            </div>
            {diagnosis.symptoms && (
              <div className="symptom-description">
                <strong>증상 설명:</strong>
                <p>{diagnosis.symptoms}</p>
              </div>
            )}
          </div>

          {/* 사진 경과 (진료 히스토리) */}
          {patientHistory.length > 0 && (
            <div className="panel">
              <h3>
                <span className="panel-icon">📅</span> 사진 경과
                <span className="count-badge">{patientHistory.length}건</span>
              </h3>
              <div className="history-grid-container">
                <div className="history-grid">
                  {historyPageItems.map((item, idx) => {
                    const imgSrc = item.images && item.images.length > 0
                      ? (item.images[0].image_path || item.images[0])
                      : null;
                    const itemId = item._id || item.id;
                    const globalIdx = safeHistoryPage * HISTORY_PER_PAGE + idx;
                    return (
                      <div
                        key={itemId || idx}
                        className="history-grid-item"
                        onClick={() => navigate(`/diagnoses/${itemId}`)}
                        title={`${new Date(item.createdAt).toLocaleDateString('ko-KR')} 편 클릭하여 상세 보기`}
                      >
                        <div className="history-thumb-wrap">
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={`히스토리 ${globalIdx + 1}`}
                              className="history-thumb"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <div className="history-thumb-none">
                              <span>📷</span>
                            </div>
                          )}
                          <div className="history-thumb-overlay">
                            <span>상세봐기 →</span>
                          </div>
                        </div>
                        <div className="history-item-meta">
                          <span className="history-item-date">
                            {new Date(item.createdAt).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}
                          </span>
                          <span className={`history-item-badge status-${item.status}`}>
                            {getStatusText(item.status)}
                          </span>
                        </div>
                        {item.images && item.images.length > 1 && (
                          <span className="history-img-cnt">📷{item.images.length}</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {historyTotalPages > 1 && (
                  <div className="history-nav">
                    <button
                      className="history-nav-btn"
                      disabled={safeHistoryPage === 0}
                      onClick={() => setCurrentHistoryPage(prev => Math.max(0, prev - 1))}
                    >‹</button>
                    <span className="history-nav-info">
                      {safeHistoryPage * HISTORY_PER_PAGE + 1}–{Math.min((safeHistoryPage + 1) * HISTORY_PER_PAGE, patientHistory.length)} / {patientHistory.length}
                    </span>
                    <button
                      className="history-nav-btn"
                      disabled={safeHistoryPage >= historyTotalPages - 1}
                      onClick={() => setCurrentHistoryPage(prev => Math.min(historyTotalPages - 1, prev + 1))}
                    >›</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ============ Column 2: 유사 패턴 증례 ============ */}
        <div className="column column-center">
          <div className="panel ai-panel">
            <h3><span className="panel-icon">🤖</span> 유사 패턴 증례</h3>
            <p className="panel-subtitle">AI가 분석한 가능성 높은 진단명 3개</p>
            
            {loadingAi ? (
              <div className="ai-loading">
                <div className="spinner"></div>
                <p>AI 분석 중...</p>
              </div>
            ) : aiSuggestions.length === 0 ? (
              <div className="ai-empty">
                <p>추천 진단이 없습니다.</p>
                <button className="btn btn-sm btn-outline" onClick={fetchAiSuggestions}>
                  다시 분석
                </button>
              </div>
            ) : (
              <div className="ai-suggestion-cards">
                {aiSuggestions.map((suggestion, idx) => (
                  <div 
                    key={idx} 
                    className={`ai-card ${selectedAiDiagnosis?.diagnosis === suggestion.diagnosis ? 'selected' : ''}`}
                    onClick={() => handleAiDiagnosisClick(suggestion)}
                  >
                    <div className="ai-card-header">
                      <span className="ai-rank">#{idx + 1}</span>
                      <span className="ai-confidence">{suggestion.confidence}%</span>
                    </div>
                    <div className="ai-card-body">
                      <h4 className="ai-diagnosis-name">{suggestion.diagnosis}</h4>
                      <p className="ai-diagnosis-desc">{suggestion.description}</p>
                    </div>
                    <div className="ai-card-footer">
                      <span className="ai-click-hint">클릭하여 차팅에 적용 →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI 진단 결과 (원본) */}
          {diagnosis.gptDiagnosis && (
            <div className="panel ai-result-panel">
              <h3><span className="panel-icon">📋</span> AI 진단 결과 (상세)</h3>
              <div className="gpt-content-text">
                {diagnosis.gptDiagnosis}
              </div>
            </div>
          )}

          {/* 의학 논문 */}
          {diagnosis.medicalPapers && diagnosis.medicalPapers.length > 0 && (
            <div className="panel">
              <h3><span className="panel-icon">📚</span> 관련 의학 정보</h3>
              <div className="papers-compact">
                {diagnosis.medicalPapers.map((paper, index) => (
                  <div key={index} className="paper-card">
                    <h4>{paper.title}</h4>
                    {paper.url && (
                      <a href={paper.url} target="_blank" rel="noopener noreferrer" className="paper-link">
                        논문 보기 →
                      </a>
                    )}
                    <p>{paper.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============ Column 3: 진단 정보 (차팅) ============ */}
        <div className="column column-right">
          <div className="panel chart-panel">
            <h3><span className="panel-icon">📝</span> 진단 정보 (차팅)</h3>

            {/* 진단명 */}
            <div className="chart-field">
              <label><span className="field-icon">🏥</span> 진단명</label>
              <div className="input-wrapper">
                <span className="input-prefix">Dx.</span>
                <input
                  type="text"
                  value={chartData.chartDiagnosisName}
                  onChange={(e) => handleChartChange('chartDiagnosisName', e.target.value)}
                  placeholder="진단명 입력 또는 유사 패턴에서 선택"
                />
              </div>
            </div>

            {/* ICD 코드 / 보험 수가 코드 — 2열 레이아웃 */}
            <div className="chart-field-row">
              <div className="chart-field">
                <label><span className="field-icon">📊</span> ICD 코드</label>
                <div className="input-wrapper">
                  <span className="input-prefix icd">ICD</span>
                  <input
                    type="text"
                    value={chartData.chartIcdCode}
                    onChange={(e) => handleChartChange('chartIcdCode', e.target.value)}
                    placeholder="예: L40.0"
                  />
                </div>
              </div>
              <div className="chart-field">
                <label><span className="field-icon">💰</span> 보험 수가</label>
                <div className="input-wrapper">
                  <span className="input-prefix ins">수가</span>
                  <input
                    type="text"
                    value={chartData.chartInsuranceCode}
                    onChange={(e) => handleChartChange('chartInsuranceCode', e.target.value)}
                    placeholder="예: KN071"
                  />
                </div>
              </div>
            </div>

            {/* 치료 가이드라인 */}
            <div className="chart-field">
              <label><span className="field-icon">💊</span> 치료 가이드라인</label>
              <textarea
                className="chart-textarea"
                value={chartData.chartTreatmentGuideline}
                onChange={(e) => handleChartChange('chartTreatmentGuideline', e.target.value)}
                placeholder="치료 가이드라인 입력"
                rows="3"
              />
            </div>

            {/* SOAP 차팅 */}
            <div className="soap-charting">
              <h4><span>📋</span> SOAP 차팅</h4>

              <div className="soap-block soap-s">
                <div className="soap-label-row">
                  <span className="soap-badge s">S</span>
                  <span className="soap-label-text">Subjective · 주관적 증상</span>
                </div>
                <textarea
                  className="chart-textarea soap-textarea"
                  value={chartData.chartSoapS}
                  onChange={(e) => handleChartChange('chartSoapS', e.target.value)}
                  placeholder="환자 호소 내용"
                  rows="3"
                />
              </div>

              <div className="soap-block soap-o">
                <div className="soap-label-row">
                  <span className="soap-badge o">O</span>
                  <span className="soap-label-text">Objective · 객관적 소견</span>
                </div>
                <textarea
                  className="chart-textarea soap-textarea"
                  value={chartData.chartSoapO}
                  onChange={(e) => handleChartChange('chartSoapO', e.target.value)}
                  placeholder="이학적 검사 소견"
                  rows="3"
                />
              </div>

              <div className="soap-block soap-a">
                <div className="soap-label-row">
                  <span className="soap-badge a">A</span>
                  <span className="soap-label-text">Assessment · 진단평가</span>
                </div>
                <textarea
                  className="chart-textarea soap-textarea"
                  value={chartData.chartSoapA}
                  onChange={(e) => handleChartChange('chartSoapA', e.target.value)}
                  placeholder="진단 평가"
                  rows="3"
                />
              </div>

              <div className="soap-block soap-p">
                <div className="soap-label-row">
                  <span className="soap-badge p">P</span>
                  <span className="soap-label-text">Plan · 치료계획</span>
                </div>
                <textarea
                  className="chart-textarea soap-textarea"
                  value={chartData.chartSoapP}
                  onChange={(e) => handleChartChange('chartSoapP', e.target.value)}
                  placeholder="치료 계획"
                  rows="3"
                />
              </div>
            </div>

            <button
              className="btn btn-chart-save"
              onClick={handleSaveCharting}
              disabled={savingChart}
            >
              {savingChart ? (
                <><span className="btn-spinner"></span> 저장 중...</>
              ) : (
                <>💾 차팅 저장</>
              )}
            </button>
            {chartSuccess && <div className="success-msg">{chartSuccess}</div>}
          </div>

          {/* 의사 소견 */}
          <div className="panel doctor-panel">
            <h3><span className="panel-icon">👨‍⚕️</span> 의사 소견</h3>
            <div className="chart-field">
              <label><span className="field-icon">💬</span> 소견 내용</label>
              <textarea
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                placeholder="환자에 대한 소견을 작성하세요..."
                rows="6"
                className="chart-textarea doctor-textarea"
              />
            </div>
            
            {error && <div className="error-msg">{error}</div>}
            {success && <div className="success-msg">{success}</div>}

            <div className="action-buttons">
              <button 
                onClick={() => handleSaveNotes('reviewed')}
                className="btn btn-success"
                disabled={saving}
              >
                {saving ? '저장 중...' : '✅ 검토 완료'}
              </button>
              <button 
                onClick={() => handleSaveNotes('completed')}
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? '저장 중...' : '✔️ 완료 처리'}
              </button>
            </div>

            <div className="meta-info">
              <p><strong>작성일:</strong> {new Date(diagnosis.createdAt).toLocaleString('ko-KR')}</p>
              {diagnosis.updatedAt !== diagnosis.createdAt && (
                <p><strong>수정일:</strong> {new Date(diagnosis.updatedAt).toLocaleString('ko-KR')}</p>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default DiagnosisDetail;
