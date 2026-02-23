const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// 환경변수 먼저 로드
dotenv.config();

// JWT_SECRET 자동 생성 (환경변수 없는 경우)
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim() === '' || process.env.JWT_SECRET === 'undefined') {
  process.env.JWT_SECRET = crypto.randomBytes(64).toString('hex');
  if (process.env.NODE_ENV !== 'production') {
    console.log('⚠️ JWT_SECRET 자동 생성됨 (프로덕션에서는 환경변수 설정 권장)');
  }
}

const { initDatabase } = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Database 초기화 후 서버 시작
const startServer = async () => {
  try {
    await initDatabase();

    // 헬스체크
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', message: '서버 정상 작동 중', timestamp: new Date().toISOString() });
    });

    // API Routes
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/patients', require('./routes/patients'));
    app.use('/api/diagnoses', require('./routes/diagnoses'));
    app.use('/api/admin', require('./routes/admin'));

    // 환자 포털 정적 파일 서빙
    const patientBuildPath = path.join(__dirname, '../patient-portal/build');
    if (fs.existsSync(patientBuildPath)) {
      app.use('/patient', express.static(patientBuildPath));
      app.get('/patient/*', (req, res) => {
        res.sendFile(path.join(patientBuildPath, 'index.html'));
      });
      console.log('✅ 환자 포털: /patient');
    } else {
      console.warn('⚠️ 환자 포털 빌드 폴더 없음');
    }

    // 관리자 대시보드 정적 파일 서빙
    const adminBuildPath = path.join(__dirname, '../admin-dashboard/build');
    if (fs.existsSync(adminBuildPath)) {
      app.use('/admin', express.static(adminBuildPath));
      app.get('/admin/*', (req, res) => {
        res.sendFile(path.join(adminBuildPath, 'index.html'));
      });
      console.log('✅ 관리자 대시보드: /admin');
    } else {
      console.warn('⚠️ 관리자 대시보드 빌드 폴더 없음');
    }

    // 루트 경로 - 환자 포털로 리다이렉트
    app.get('/', (req, res) => {
      res.redirect('/patient');
    });

    // 404 처리 - API가 아닌 경로는 에러 반환
    app.use((req, res, next) => {
      if (req.path.startsWith('/api')) {
        res.status(404).json({ error: 'Endpoint not found' });
      } else {
        // 정적 파일 404는 환자 포털로 리다이렉트
        res.redirect('/patient');
      }
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    });

    const PORT = process.env.PORT || 5000;
    const HOST = '0.0.0.0';
    app.listen(PORT, HOST, () => {
      console.log(`\n🚀 서버 실행 중: ${HOST}:${PORT}`);
      console.log(`📱 환자 포털: http://localhost:${PORT}/patient`);
      console.log(`👨‍⚕️ 관리자: http://localhost:${PORT}/admin`);
      console.log(`🔌 API: http://localhost:${PORT}/api\n`);
    });
  } catch (error) {
    console.error('서버 시작 실패:', error);
    process.exit(1);
  }
};

startServer();
