const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

dotenv.config();

// JWT_SECRET이 없으면 자동 생성 (프로덕션에서는 환경변수 설정 권장)
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = crypto.randomBytes(64).toString('hex');
  console.log('⚠️ JWT_SECRET이 설정되지 않아 자동 생성되었습니다.');
  console.log('프로덕션 환경에서는 환경 변수로 설정하는 것을 권장합니다.');
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

    // DB 디버그 엔드포인트 (배포 후 삭제할 것)
    app.get('/api/debug/db', async (req, res) => {
      const { pool } = require('./config/database');
      const result = { env: {}, connection: null, tables: null, usersSchema: null, error: null };

      // 환경변수 확인 (값은 숨김)
      result.env = {
        DB_HOST: process.env.DB_HOST ? '✅ set' : '❌ missing',
        DB_PORT: process.env.DB_PORT ? '✅ ' + process.env.DB_PORT : '❌ missing',
        DB_USER: process.env.DB_USER ? '✅ set' : '❌ missing',
        DB_PASSWORD: process.env.DB_PASSWORD ? '✅ set' : '❌ missing',
        DB_NAME: process.env.DB_NAME ? '✅ ' + process.env.DB_NAME : '❌ missing',
        DB_SSL: process.env.DB_SSL || 'not set',
        JWT_SECRET: process.env.JWT_SECRET ? '✅ set' : '❌ missing',
        NODE_ENV: process.env.NODE_ENV || 'not set'
      };

      try {
        // DB 연결 테스트
        const [rows] = await pool.query('SELECT 1 as test');
        result.connection = '✅ connected';

        // 테이블 목록
        const [tables] = await pool.query('SHOW TABLES');
        result.tables = tables;

        // users 테이블 스키마
        try {
          const [schema] = await pool.query('DESCRIBE users');
          result.usersSchema = schema;
        } catch (e) {
          result.usersSchema = 'Error: ' + e.message;
        }

        // users 수
        try {
          const [count] = await pool.query('SELECT COUNT(*) as count FROM users');
          result.userCount = count[0].count;
        } catch (e) { }

      } catch (e) {
        result.connection = '❌ failed';
        result.error = e.message;
      }

      res.json(result);
    });

    // API Routes
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/patients', require('./routes/patients'));
    app.use('/api/diagnoses', require('./routes/diagnoses'));
    app.use('/api/admin', require('./routes/admin'));

    // 환자 포털 정적 파일 서빙
    const patientBuildPath = path.join(__dirname, '../patient-portal/build');
    console.log('환자 포털 빌드 경로:', patientBuildPath);
    console.log('환자 포털 빌드 존재 여부:', fs.existsSync(patientBuildPath));

    if (fs.existsSync(patientBuildPath)) {
      app.use('/patient', express.static(patientBuildPath));
      app.get('/patient/*', (req, res) => {
        res.sendFile(path.join(patientBuildPath, 'index.html'));
      });
      console.log('✅ 환자 포털 정적 파일 서빙 설정 완료');
    } else {
      console.warn('⚠️ 환자 포털 빌드 폴더를 찾을 수 없습니다:', patientBuildPath);
    }

    // 관리자 대시보드 정적 파일 서빙
    const adminBuildPath = path.join(__dirname, '../admin-dashboard/build');
    console.log('관리자 대시보드 빌드 경로:', adminBuildPath);
    console.log('관리자 대시보드 빌드 존재 여부:', fs.existsSync(adminBuildPath));

    if (fs.existsSync(adminBuildPath)) {
      app.use('/admin', express.static(adminBuildPath));
      app.get('/admin/*', (req, res) => {
        res.sendFile(path.join(adminBuildPath, 'index.html'));
      });
      console.log('✅ 관리자 대시보드 정적 파일 서빙 설정 완료');
    } else {
      console.warn('⚠️ 관리자 대시보드 빌드 폴더를 찾을 수 없습니다:', adminBuildPath);
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
    const HOST = '0.0.0.0'; // 모든 네트워크 인터페이스에서 접근 가능
    app.listen(PORT, HOST, () => {
      console.log(`서버가 ${HOST}:${PORT}에서 실행 중입니다.`);
      console.log(`네트워크 접속: http://10.10.30.175:${PORT}`);
    });
  } catch (error) {
    console.error('서버 시작 실패:', error);
    process.exit(1);
  }
};

startServer();
