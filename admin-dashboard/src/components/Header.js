import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header({ user, onLogout }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-brand">
          <div className="header-logo">🔬</div>
          <h1>SkinIQ Doctor</h1>
        </div>
        <nav>
          <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
            📊 대시보드
          </Link>
          <Link to="/diagnoses" className={isActive('/diagnoses') ? 'active' : ''}>
            🔬 진단 목록
          </Link>
          <Link to="/patients" className={isActive('/patients') ? 'active' : ''}>
            👥 환자 목록
          </Link>
          <div className="nav-divider" />
          <div className="user-info">
            <div className="user-avatar">
              {user.name ? user.name.charAt(0) : 'D'}
            </div>
            <span>Dr. {user.name}</span>
          </div>
          <button onClick={onLogout} className="btn btn-secondary">로그아웃</button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
