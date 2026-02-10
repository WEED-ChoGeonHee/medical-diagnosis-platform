import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ user, onLogout }) {
  return (
    <header className="header">
      <div className="header-content">
        <h1>의료 진단 플랫폼 - 관리자</h1>
        <nav>
          <Link to="/dashboard">대시보드</Link>
          <Link to="/diagnoses">진단 목록</Link>
          <Link to="/patients">환자 목록</Link>
          <span className="user-info">Dr. {user.name}</span>
          <button onClick={onLogout} className="btn btn-secondary">로그아웃</button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
