import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ user, onLogout }) {
  return (
    <header className="header">
      <div className="header-content">
        <h1>의료 진단 플랫폼</h1>
        <nav>
          <Link to="/dashboard">대시보드</Link>
          <Link to="/new-diagnosis">새 진단</Link>
          <span className="user-info">{user.name}님</span>
          <button onClick={onLogout} className="btn btn-secondary">로그아웃</button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
