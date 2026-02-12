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
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, diagnosesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/diagnoses?limit=5')
      ]);

      setStats(statsRes.data);
      setRecentDiagnoses(diagnosesRes.data.diagnoses || []);
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

  const getStatusIcon = (status) => {
    const iconMap = {
      'pending': '🟡',
      'reviewed': '🔵',
      'completed': '🟢'
    };
    return iconMap[status] || '⚪';
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '좋은 아침입니다';
    if (hour < 18) return '좋은 오후입니다';
    return '좋은 저녁입니다';
  };

  const completedDiagnoses = stats.totalDiagnoses - stats.pendingDiagnoses - stats.reviewedDiagnoses;
  const completionRate = stats.totalDiagnoses > 0
    ? Math.round(((completedDiagnoses + stats.reviewedDiagnoses) / stats.totalDiagnoses) * 100)
    : 0;

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <p>데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="container dashboard">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-text">
          <h2>{getGreeting()} 👋</h2>
          <p>오늘의 의료 데이터 현황을 확인하세요</p>
        </div>
        <div className="welcome-date">
          <span className="date-text">
            {currentTime.toLocaleDateString('ko-KR', {
              year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
            })}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card kpi-patients">
          <div className="kpi-icon-wrap">
            <span className="kpi-icon">👥</span>
          </div>
          <div className="kpi-body">
            <span className="kpi-value">{stats.totalPatients}</span>
            <span className="kpi-label">총 환자</span>
          </div>
          <div className="kpi-trend">
            <span className="kpi-trend-badge positive">활성</span>
          </div>
        </div>

        <div className="kpi-card kpi-diagnoses">
          <div className="kpi-icon-wrap">
            <span className="kpi-icon">📋</span>
          </div>
          <div className="kpi-body">
            <span className="kpi-value">{stats.totalDiagnoses}</span>
            <span className="kpi-label">총 진단</span>
          </div>
          <div className="kpi-trend">
            <span className="kpi-trend-badge info">전체</span>
          </div>
        </div>

        <div className="kpi-card kpi-pending">
          <div className="kpi-icon-wrap">
            <span className="kpi-icon">⏳</span>
          </div>
          <div className="kpi-body">
            <span className="kpi-value">{stats.pendingDiagnoses}</span>
            <span className="kpi-label">대기 중</span>
          </div>
          <div className="kpi-trend">
            <span className="kpi-trend-badge warning">미처리</span>
          </div>
        </div>

        <div className="kpi-card kpi-reviewed">
          <div className="kpi-icon-wrap">
            <span className="kpi-icon">✅</span>
          </div>
          <div className="kpi-body">
            <span className="kpi-value">{stats.reviewedDiagnoses}</span>
            <span className="kpi-label">검토 완료</span>
          </div>
          <div className="kpi-trend">
            <span className="kpi-trend-badge positive">완료</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Progress + Charts */}
      <div className="middle-row">
        {/* Completion Ring */}
        <div className="card progress-card">
          <h3 className="card-title">진단 처리율</h3>
          <div className="progress-ring-container">
            <svg className="progress-ring" viewBox="0 0 120 120">
              <circle className="progress-ring-bg" cx="60" cy="60" r="50" />
              <circle
                className="progress-ring-fill"
                cx="60" cy="60" r="50"
                style={{
                  strokeDasharray: `${2 * Math.PI * 50}`,
                  strokeDashoffset: `${2 * Math.PI * 50 * (1 - completionRate / 100)}`
                }}
              />
            </svg>
            <div className="progress-ring-value">
              <span className="ring-number">{completionRate}</span>
              <span className="ring-percent">%</span>
            </div>
          </div>
          <div className="progress-legend">
            <div className="legend-item">
              <span className="legend-dot completed" />
              <span>검토 완료: {stats.reviewedDiagnoses + completedDiagnoses}</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot pending" />
              <span>대기 중: {stats.pendingDiagnoses}</span>
            </div>
          </div>
        </div>

        {/* Symptom Stats */}
        {stats.symptomStats && stats.symptomStats.length > 0 && (
          <div className="card chart-card">
            <h3 className="card-title">증상 분류</h3>
            <div className="bar-chart">
              {stats.symptomStats.map((stat, index) => {
                const maxCount = Math.max(...stats.symptomStats.map(s => s.count));
                const percentage = maxCount > 0 ? (stat.count / maxCount) * 100 : 0;
                const colors = ['#4f8cff', '#a855f7', '#34d399', '#fb923c', '#f472b6', '#fbbf24'];
                return (
                  <div key={index} className="bar-row">
                    <span className="bar-label">{stat.symptom_type}</span>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${percentage}%`,
                          background: `linear-gradient(90deg, ${colors[index % colors.length]}, ${colors[(index + 1) % colors.length]})`,
                          animationDelay: `${index * 0.1}s`
                        }}
                      />
                    </div>
                    <span className="bar-count">{stat.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Skin Type Stats */}
        {stats.skinTypeStats && stats.skinTypeStats.length > 0 && (
          <div className="card chart-card">
            <h3 className="card-title">피부 타입</h3>
            <div className="donut-chart-container">
              {(() => {
                const total = stats.skinTypeStats.reduce((sum, s) => sum + s.count, 0);
                const colors = ['#4f8cff', '#a855f7', '#34d399', '#fb923c', '#f472b6', '#fbbf24'];
                let cumulativePercent = 0;
                const segments = stats.skinTypeStats.map((stat, i) => {
                  const percent = total > 0 ? (stat.count / total) * 100 : 0;
                  const startPercent = cumulativePercent;
                  cumulativePercent += percent;
                  return { ...stat, percent, startPercent, color: colors[i % colors.length] };
                });

                const gradientParts = segments.map(s =>
                  `${s.color} ${s.startPercent}% ${s.startPercent + s.percent}%`
                ).join(', ');

                return (
                  <>
                    <div
                      className="donut-chart"
                      style={{
                        background: `conic-gradient(${gradientParts})`
                      }}
                    >
                      <div className="donut-center">
                        <span className="donut-total">{total}</span>
                        <span className="donut-label">전체</span>
                      </div>
                    </div>
                    <div className="donut-legend">
                      {segments.map((seg, i) => (
                        <div key={i} className="donut-legend-item">
                          <span className="donut-legend-dot" style={{ background: seg.color }} />
                          <span className="donut-legend-text">{seg.skin_type}</span>
                          <span className="donut-legend-count">{seg.count}</span>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Recent Diagnoses Table */}
      <div className="card table-card">
        <div className="card-header-row">
          <h3 className="card-title">최근 진단 요청</h3>
          <Link to="/diagnoses" className="btn btn-primary btn-sm">
            전체 보기 →
          </Link>
        </div>

        {recentDiagnoses.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p>진단 요청이 없습니다</p>
            <span className="empty-sub">환자가 진단을 요청하면 여기에 표시됩니다</span>
          </div>
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
                  <tr key={diagnosis.id || diagnosis._id}>
                    <td>
                      <div className="patient-cell">
                        <div className="patient-avatar">
                          {(diagnosis.patient?.name || diagnosis.patient_name || '?').charAt(0)}
                        </div>
                        <span>{diagnosis.patient?.name || diagnosis.patient_name || '-'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="tag tag-symptom">{diagnosis.symptom_type}</span>
                    </td>
                    <td>
                      <span className="tag tag-skin">{diagnosis.skin_type}</span>
                    </td>
                    <td>
                      <span className={`status-badge status-${diagnosis.status}`}>
                        {getStatusIcon(diagnosis.status)} {getStatusText(diagnosis.status)}
                      </span>
                    </td>
                    <td className="date-cell">
                      {new Date(diagnosis.created_at || diagnosis.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td>
                      <Link to={`/diagnosis/${diagnosis.id || diagnosis._id}`} className="action-link">
                        상세보기 →
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
