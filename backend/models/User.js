const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = {
  // 사용자 생성
  async create(userData) {
    const { email, password, name, phone, role = 'patient' } = userData;
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const [result] = await pool.query(
      'INSERT INTO users (email, password, name, phone, role) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, name, phone, role]
    );
    
    return { id: result.insertId, email, name, role, phone };
  },

  // 이메일로 사용자 찾기
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  // ID로 사용자 찾기
  async findById(id) {
    const [rows] = await pool.query('SELECT id, email, name, role, phone, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  // 비밀번호 검증
  async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  },

  // 모든 환자 조회
  async findAllPatients() {
    const [rows] = await pool.query(
      'SELECT id, email, name, phone, created_at FROM users WHERE role = ? ORDER BY created_at DESC',
      ['patient']
    );
    return rows;
  }
};

module.exports = User;
