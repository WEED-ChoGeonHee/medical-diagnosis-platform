import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDiagnoses: 0,
    pendingDiagnoses: 0,
    reviewedDiagnoses: 0,
    symptomStats: [],
    skinTypeStats: []
  });
  const [recentDiagnoses, setRecentDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, diagnosesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/diagnoses?limit=5')
      ]);

      setStats(statsRes.data);
      setRecentDiagnoses(diagnosesRes.data.diagnoses);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
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
    <div className="container dashboard">
      <h2>피부과 관리자 대시보드</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalPatients}</h3>
            <p>총 환자 수</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats.totalDiagnoses}</h3>
            <p>총 진단 수</p>
          </div>
        </div>
        
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pendingDiagnoses}</h3>
            <p>대기 중 진단</p>
          </div>
        </div>
        
        <div className="stat-card reviewed">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.reviewedDiagnoses}</h3>
            <p>검토 완료</p>
          </div>
        </div>
      </div>

      <div className="stats-row">
        {stats.symptomStats && stats.symptomStats.length > 0 && (
          <div className="card stats-card">
            <h3>증상 종류별 통계</h3>
            <div className="stats-list">
              {stats.symptomStats.map((stat, index) => (
                <div key={index} className="stats-item">
                  <span className="stats-label">{stat.symptom_type}</span>
                  <span className="stats-value">{stat.count}건</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {stats.skinTypeStats && stats.skinTypeStats.length > 0 && (
          <div className="card stats-card">
            <h3>피부 타입별 통계</h3>
            <div className="stats-list">
              {stats.skinTypeStats.map((stat, index) => (
                <div key={index} className="stats-item">
                  <span className="stats-label">{stat.skin_type}</span>
                  <span className="stats-value">{stat.count}건</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <h3>최근 진단 요청</h3>
          <Link to="/diagnoses" className="btn btn-primary">전체 보기</Link>
        </div>
        
        {recentDiagnoses.length === 0 ? (
          <p>진단 요청이 없습니다.</p>
        ) : (
          <div className="diagnoses-table">
            <table>
              <thead>
                <tr>
                  <th>환자명</th>
                  <th>증상 종류</th>
                  <th>피부 타입</th>
                  <th>상태</th>
                  <th>작성일</th>
                  <th>동작</th>
                </tr>
              </thead>
              <tbody>
                {recentDiagnoses.map((diagnosis) => (
                  <tr key={diagnosis._id}>
                    <td>{diagnosis.patient?.name}</td>
                    <td>{diagnosis.symptom_type}</td>
                    <td>{diagnosis.skin_type}</td>
                    <td>
                      <span className={`status-badge status-${diagnosis.status}`}>
                        {getStatusText(diagnosis.status)}
                      </span>
                    </td>
                    <td>{new Date(diagnosis.createdAt).toLocaleDateString('ko-KR')}</td>
                    <td>
                      <Link to={`/diagnosis/${diagnosis._id}`} className="btn-link">
                        상세보기
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
