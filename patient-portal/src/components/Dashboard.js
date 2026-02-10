import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './Dashboard.css';

function Dashboard() {
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDiagnoses();
  }, []);

  const fetchDiagnoses = async () => {
    try {
      const response = await api.get('/diagnoses/my');
      setDiagnoses(response.data);
    } catch (err) {
      setError('진단 내역을 불러오는데 실패했습니다.');
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

  const getStatusClass = (status) => {
    return `status-badge status-${status}`;
  };

  if (loading) {
    return <div className="container loading">로딩 중...</div>;
  }

  return (
    <div className="container dashboard">
      <div className="dashboard-header">
        <h2>내 진단 내역</h2>
        <Link to="/new-diagnosis" className="btn btn-primary">새 진단 요청</Link>
      </div>

      {error && <div className="error">{error}</div>}

      {diagnoses.length === 0 ? (
        <div className="card">
          <p>아직 진단 내역이 없습니다.</p>
          <Link to="/new-diagnosis" className="btn btn-primary">첫 진단 요청하기</Link>
        </div>
      ) : (
        <div className="diagnoses-list">
          {diagnoses.map((diagnosis) => (
            <Link 
              to={`/diagnosis/${diagnosis._id}`} 
              key={diagnosis._id} 
              className="diagnosis-card"
            >
              <div className="diagnosis-header">
                <h3>진단 요청</h3>
                <span className={getStatusClass(diagnosis.status)}>
                  {getStatusText(diagnosis.status)}
                </span>
              </div>
              <p className="diagnosis-symptoms">{diagnosis.symptoms.substring(0, 100)}...</p>
              <div className="diagnosis-footer">
                <span>{new Date(diagnosis.createdAt).toLocaleDateString('ko-KR')}</span>
                {diagnosis.images.length > 0 && (
                  <span>📷 {diagnosis.images.length}개 이미지</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
