import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './DiagnosisList.css';

function DiagnosisList() {
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [treatmentTypeFilter, setTreatmentTypeFilter] = useState('all');
  const [patientRegistrationNumber, setPatientRegistrationNumber] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 진료 종류
  const treatmentTypes = ['보험진료', '색소진료', '부작용 진료'];

  useEffect(() => {
    fetchDiagnoses();
  }, [filter, treatmentTypeFilter, patientRegistrationNumber, currentPage]);

  const fetchDiagnoses = async () => {
    try {
      const statusParam = filter !== 'all' ? `&status=${filter}` : '';
      const treatmentParam = treatmentTypeFilter !== 'all' ? `&treatment_type=${encodeURIComponent(treatmentTypeFilter)}` : '';
      const registrationParam = patientRegistrationNumber ? `&patient_registration_number=${encodeURIComponent(patientRegistrationNumber)}` : '';
      const response = await api.get(`/admin/diagnoses?page=${currentPage}${statusParam}${treatmentParam}${registrationParam}`);
      setDiagnoses(response.data.diagnoses);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('진단 목록 로드 실패:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="container diagnosis-list">
      <h2>피부과 진단 목록</h2>

      <div className="filters">
        <div className="filter-group">
          <label>상태</label>
          <div className="filter-buttons">
            <button 
              className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => { setFilter('all'); setCurrentPage(1); }}
            >
              전체
            </button>
            <button 
              className={filter === 'pending' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => { setFilter('pending'); setCurrentPage(1); }}
            >
              대기 중
            </button>
            <button 
              className={filter === 'reviewed' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => { setFilter('reviewed'); setCurrentPage(1); }}
            >
              검토 완료
            </button>
            <button 
              className={filter === 'completed' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => { setFilter('completed'); setCurrentPage(1); }}
            >
              완료
            </button>
          </div>
        </div>

        <div className="filter-group">
          <label>진료 종류</label>
          <select 
            value={treatmentTypeFilter} 
            onChange={(e) => { setTreatmentTypeFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="all">전체</option>
            {treatmentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>환자 등록번호</label>
          <input 
            type="text"
            placeholder="등록번호 검색"
            value={patientRegistrationNumber} 
            onChange={(e) => { setPatientRegistrationNumber(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      <div className="card">
        {diagnoses.length === 0 ? (
          <p>진단 요청이 없습니다.</p>
        ) : (
          <>
            <div className="diagnoses-table">
              <table>
                <thead>
                  <tr>
                    <th>환자명</th>
                    <th>등록번호</th>
                    <th>성별</th>
                    <th>진료종류</th>
                    <th>부위</th>
                    <th>증상 설명</th>
                    <th>피부 증상</th>
                    <th>기간</th>
                    <th>통증(VAS)</th>
                    <th>이미지</th>
                    <th>상태</th>
                    <th>작성일</th>
                    <th>동작</th>
                  </tr>
                </thead>
                <tbody>
                  {diagnoses.map((diagnosis) => (
                    <tr key={diagnosis._id}>
                      <td>{diagnosis.patient?.name}</td>
                      <td>{diagnosis.patientRegistrationNumber || '-'}</td>
                      <td>{diagnosis.gender === 'male' ? '남성' : '여성'}</td>
                      <td>{diagnosis.treatmentType || '-'}</td>
                      <td>{diagnosis.bodyParts || '-'}</td>
                      <td className="symptoms-cell">
                        {diagnosis.symptoms ? diagnosis.symptoms.substring(0, 50) + '...' : '-'}
                      </td>
                      <td>
                        {diagnosis.skinSymptoms || diagnosis.skinFeatures || '-'}
                      </td>
                      <td>
                        {diagnosis.duration || '-'}
                      </td>
                      <td>
                        {diagnosis.painVas !== null && diagnosis.painVas !== undefined ? `${diagnosis.painVas}/10` : '-'}
                      </td>
                      <td>
                        {diagnosis.images.length > 0 ? `📷 ${diagnosis.images.length}개` : '-'}
                      </td>
                      <td>
                        <span className={`status-badge status-${diagnosis.status}`}>
                          {getStatusText(diagnosis.status)}
                        </span>
                      </td>
                      <td>{new Date(diagnosis.createdAt).toLocaleDateString('ko-KR')}</td>
                      <td>
                        <Link to={`/diagnosis/${diagnosis._id}`} className="btn btn-primary btn-sm">
                          상세보기
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="btn btn-secondary"
                >
                  이전
                </button>
                <span>페이지 {currentPage} / {totalPages}</span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="btn btn-secondary"
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DiagnosisList;
