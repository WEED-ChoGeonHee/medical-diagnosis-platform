const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// 프로필 조회
router.get('/profile', protect, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '프로필 조회 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
