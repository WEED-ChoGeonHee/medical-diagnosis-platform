const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// 회원가입
router.post('/register',
  [
    body('email').isEmail().withMessage('유효한 이메일을 입력하세요'),
    body('password').isLength({ min: 6 }).withMessage('비밀번호는 최소 6자 이상이어야 합니다'),
    body('name').notEmpty().withMessage('이름을 입력하세요')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password, name, phone, role } = req.body;

      // 중복 확인
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
      }

      const user = await User.create({
        email,
        password,
        name,
        phone,
        role: role || 'patient'
      });

      // JWT 토큰 생성
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: '회원가입이 완료되었습니다.',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      console.error('회원가입 에러 상세:', error.message, error.code, error.errno);
      res.status(500).json({
        message: '회원가입 중 오류가 발생했습니다.',
        debug_error: error.message,
        debug_code: error.code
      });
    }
  }
);

// 로그인
router.post('/login',
  [
    body('email').isEmail().withMessage('유효한 이메일을 입력하세요'),
    body('password').notEmpty().withMessage('비밀번호를 입력하세요')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      }

      const isMatch = await User.comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: '로그인 성공',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: '로그인 중 오류가 발생했습니다.' });
    }
  }
);

module.exports = router;
