FROM node:18-alpine

WORKDIR /app

# 의존성 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install --production

# 소스 코드 복사
COPY . .

# 업로드 디렉토리 생성
RUN mkdir -p uploads

# 포트 노출
EXPOSE 5000

# 앱 실행
CMD ["node", "server.js"]
