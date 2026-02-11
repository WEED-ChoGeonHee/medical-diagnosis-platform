import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DiagnosisList from './components/DiagnosisList';
import DiagnosisDetail from './components/DiagnosisDetail';
import PatientList from './components/PatientList';
import Header from './components/Header';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role === 'doctor') {
        setUser(parsedUser);
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    if (userData.role !== 'doctor') {
      alert('의사 계정만 접근할 수 있습니다.');
      return;
    }
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <Router basename="/admin">
      <div className="App">
        {user && <Header user={user} onLogout={handleLogout} />}
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/diagnoses"
            element={user ? <DiagnosisList /> : <Navigate to="/login" />}
          />
          <Route
            path="/diagnosis/:id"
            element={user ? <DiagnosisDetail /> : <Navigate to="/login" />}
          />
          <Route
            path="/patients"
            element={user ? <PatientList /> : <Navigate to="/login" />}
          />
          <Route
            path="/"
            element={<Navigate to={user ? "/dashboard" : "/login"} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
