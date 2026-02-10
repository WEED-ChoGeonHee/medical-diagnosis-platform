import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './DiagnosisList.css';

function DiagnosisList() {
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDiagnoses();
  }, [filter, currentPage]);

  const fetchDiagnoses = async () => {
    try {
      const statusParam = filter !== 'all' ? `&status=${filter}` : '';
      const response = await api.get(`/admin/diagnoses?page=${currentPage}${statusParam}`);
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
      <h2>진단 목록</h2>

      <div className="filters">
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
                    <th>이메일</th>
                    <th>증상</th>
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
                      <td>{diagnosis.patient?.email}</td>
                      <td className="symptoms-cell">
                        {diagnosis.symptoms.substring(0, 60)}...
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
