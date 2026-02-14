// 피부과 진단 상세 정보 기본 데이터 시딩
require('dotenv').config();
const { pool, initDatabase } = require('./config/database');

const dermatologyData = [
  {
    diagnosis_name: 'Psoriasis',
    diagnosis_name_kr: '건선',
    icd_code: 'L40.0',
    insurance_code: 'KN071, KN072, KN073',
    treatment_guideline: `1. 경증: 국소 치료제 (스테로이드, 비타민D 유도체, 칼시포트리올)
2. 중등도: 광선치료 (UVB, PUVA), 국소 치료제 병용
3. 중증: 전신 치료제 (메토트렉세이트, 사이클로스포린, 레티노이드)
4. 생물학적 제제: TNF-α 억제제, IL-17 억제제, IL-23 억제제
5. 생활 관리: 보습, 스트레스 관리, 금연, 절주`,
    soap_s: '환자 호소: 피부에 붉은 반점과 은백색 비늘이 있음. 가려움증 동반. 무릎, 팔꿈치, 두피에 주로 발생. 스트레스 시 악화됨.',
    soap_o: '이학적 검사: 경계가 명확한 홍반성 판, 은백색 인설, Auspitz sign 양성, 손발톱 함몰점 관찰. 관절 통증 없음.',
    soap_a: '진단: 판상 건선 (Plaque Psoriasis, L40.0). PASI 점수 측정 권장. 건선성 관절염 배제 필요.',
    soap_p: '치료 계획: 1) 칼시포트리올/베타메타손 복합 연고 1일 1회 도포 2) 보습제 자주 사용 3) 2주 후 재진 4) 호전 없을 시 광선치료 고려'
  },
  {
    diagnosis_name: 'Furuncle (Boil)',
    diagnosis_name_kr: '종기',
    icd_code: 'L02.9',
    insurance_code: 'KN031, KN032',
    treatment_guideline: `1. 초기: 온찜질, 국소 항생제 연고
2. 농양 형성: 절개 배농 (I&D)
3. 항생제: 세팔로스포린, 클린다마이신 (MRSA 의심 시)
4. 재발성: 비강 내 무피로신 도포, 클로르헥시딘 세정
5. 주의: 얼굴 T-zone 부위는 절개 주의 (해면정맥동 혈전증 위험)`,
    soap_s: '환자 호소: 피부에 붉고 아픈 돌기가 생김. 점점 커지고 고름이 보임. 열감과 압통 있음. 발열 동반 여부 확인.',
    soap_o: '이학적 검사: 1-2cm 크기의 홍반성 결절, 중앙에 농포 형성, 변동감 양성, 압통 심함. 림프절 종대 여부 확인.',
    soap_a: '진단: 종기 (Furuncle, L02.9). 농양 형성 단계로 절개 배농 필요. 당뇨, 면역저하 상태 확인 필요.',
    soap_p: '치료 계획: 1) 절개 배농 시행 2) 세팔렉신 500mg 1일 3회, 7일간 3) 무피로신 연고 4) 2-3일 후 재진 5) 재발 시 당뇨 검사'
  },
  {
    diagnosis_name: 'Atopic Dermatitis',
    diagnosis_name_kr: '아토피',
    icd_code: 'L20.9',
    insurance_code: 'KN051, KN052, KN053',
    treatment_guideline: `1. 급성기: 중등도 스테로이드 도포, 습포법
2. 유지기: 저강도 스테로이드, 타크로리무스/피메크로리무스
3. 보습: 세라마이드 함유 보습제, 목욕 후 즉시 도포
4. 가려움 조절: 항히스타민제
5. 중증: 전신 스테로이드 단기 사용, 사이클로스포린, 두필루맙
6. 예방: 자극 물질 회피, 적절한 온습도 유지, 순면 의류`,
    soap_s: '환자 호소: 피부가 건조하고 심하게 가려움. 긁으면 더 악화됨. 아토피 가족력 있음. 계절 변화, 스트레스 시 악화.',
    soap_o: '이학적 검사: 피부 건조, 태선화, 습진성 병변, 굴측부 호발. SCORAD 지수 측정. IgE 상승 여부 확인.',
    soap_a: '진단: 아토피 피부염 (Atopic Dermatitis, L20.9). 중등도. 알레르기 검사 고려. 천식, 알레르기 비염 동반 확인.',
    soap_p: '치료 계획: 1) 타크로리무스 0.1% 연고 1일 2회 2) 세라마이드 보습제 수시로 3) 세티리진 10mg 1일 1회 4) 목욕 시간 단축 5) 2주 후 재진'
  }
];

async function seedData() {
  try {
    console.log('🔄 데이터베이스 초기화 중...');
    await initDatabase();
    
    console.log('📋 피부과 진단 상세 정보 테이블 확인/생성 중...');
    
    // 테이블 생성 (이미 database.js에서 생성되지만 확실하게)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS dermatology_diagnoses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        diagnosis_name VARCHAR(255) NOT NULL,
        diagnosis_name_kr VARCHAR(255) NOT NULL,
        icd_code VARCHAR(50) NOT NULL,
        insurance_code VARCHAR(100),
        treatment_guideline TEXT,
        soap_s TEXT,
        soap_o TEXT,
        soap_a TEXT,
        soap_p TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 기존 데이터 확인
    const [existing] = await pool.query('SELECT COUNT(*) as count FROM dermatology_diagnoses');
    
    if (existing[0].count > 0) {
      console.log('⚠️ 기존 데이터가 있습니다. 삭제 후 재삽입합니다...');
      await pool.query('DELETE FROM dermatology_diagnoses');
    }

    // 데이터 삽입
    console.log('📥 피부과 진단 데이터 삽입 중...');
    for (const data of dermatologyData) {
      await pool.query(
        `INSERT INTO dermatology_diagnoses 
         (diagnosis_name, diagnosis_name_kr, icd_code, insurance_code, treatment_guideline, soap_s, soap_o, soap_a, soap_p)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.diagnosis_name,
          data.diagnosis_name_kr,
          data.icd_code,
          data.insurance_code,
          data.treatment_guideline,
          data.soap_s,
          data.soap_o,
          data.soap_a,
          data.soap_p
        ]
      );
      console.log(`  ✅ ${data.diagnosis_name_kr} (${data.diagnosis_name}) 추가됨`);
    }

    console.log('✅ 피부과 진단 데이터 시딩 완료!');
    
    // 결과 확인
    const [results] = await pool.query('SELECT id, diagnosis_name, diagnosis_name_kr, icd_code FROM dermatology_diagnoses');
    console.log('\n📊 삽입된 데이터:');
    console.table(results);

    process.exit(0);
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

seedData();
