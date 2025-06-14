const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'hello_our_agv_age_is_30.5yrs_old'

const app = express();
const PORT = 5050;

// 전달된 인자가 문자열인지, 문자열이라면 앞뒤 공백 제거 후 그 길이가 1 이상인지 체크하는 함수
// 즉 null, number 타입, 빈 문자열 '', 공백만 있는 문자열 '  ' 등은 false를 반환!
function isValidString(str) {
  return typeof str === 'string' && str.trim().length > 0;
}

// JWT 토큰 검증 미들웨어
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization; // 요청 헤더에서 Auth 값 가져오기

  if (!authHeader) {
    return res.status(401).json({ error: '인증 토큰이 없습니다.' });  // Auth 없으면... 에러!
  }

  const token = authHeader.split(' ')[1]; // Bearer <token> 형식에서 토큰만 파싱

  try {
    const decoded = jwt.verify(token, JWT_SECRET);  // 토큰 유효성 검증(서명, 만료 시간 확인 등에 포함됨)
    req.user = decoded; // 유효한 토큰이면 사용자 정보를 req.user에 저장

    next();
  } catch (err) {
    return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });  // 에러 처리
  }
}

//CORS 설정
app.use(cors());

// JSON 파싱 가능하도록 설정
app.use(express.json());

// POST /api/post, 게시글 등록: title1, title2 받아서 BalanceGamePost 테이블에 삽입
app.post('/api/post', verifyToken, (req, res) => {
  const { title1, title2 } = req.body;  //req.body 객체에서 title1, title2 속성 추출 -> 객체 디스트럭처링 문법

  if (!isValidString(title1) || !isValidString(title2)) {
    return res.status(400).json({ error: 'title1과 title2를 모두 입력해주세요.' });
  }
  
  //user_id를 JWT 토큰에서 추출한 값으로 대체함
  const userIdFromToken = req.user.user_id;

  const sql = 'INSERT INTO BalanceGamePost (title1, title2, user_id) VALUES (?, ?, ?)';

  db.query(sql, [title1, title2, userIdFromToken], (err,result) => {
    if (err) {
      console.error('Insert 실패:', err);
      return res.status(500).json({ error: 'DB 오류' });
    }
    res.status(201).json({ message: 'Insert 성공', post_id: result.insertId });
  });
});


// POST api/signup, 회원가입
app.post('/api/signup', async (req, res) => {
  const { login_id, password, username } = req.body;

  // 요청 바디가 모두 들어왔는지 체크
  if (!isValidString(login_id) || !isValidString(password) || !isValidString(username)) {
    return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
  }

  // 이미 존재하는 login_id인지 중복 확인
  try {
    const checkSql = 'SELECT * FROM Users WHERE login_id = ?';
    db.query(checkSql, [login_id], async (err, results) => {
      if (err) {
        console.error('DB 오류:', err);
        return res.status(500).json({error: 'DB 오류'});
      }

      if (results.length > 0) {
        // login_id 중복
        return res.status(409).json({ error: '이미 존재하는 ID입니다.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const insertSql = 'INSERT INTO Users (login_id, password, username) VALUES (?, ?, ?)';
      db.query(insertSql, [login_id, hashedPassword, username], (err, result) => {
        if (err) {
          console.error('회원가입 실패:', err);
          return res.status(500).json({ error: '회원가입 실패' });
        }
        res.status(201).json({ message: '회원가입 성공', user_id: result.insertId });
      });
    });
  } catch (err) {
    console.error('예상치 못한 오류', err);
    res.status(500).json({ error: '서버 오류' });
  }
});

// POST /api/login, 로그인
app.post('/api/login', (req, res) => {
  const { login_id, password } = req.body;

  if (!isValidString(login_id) || !isValidString(password)) {
    return res.status(400).json({ error: 'ID와 비밀번호를 입력해주세요.' });
  }

  const findUserSql = 'SELECT * FROM Users WHERE login_id = ?';
  db.query(findUserSql, [login_id], async (err, results) => {
    if (err) {
      console.error('DB 조회 오류:', err);
      return res.status(500).json({ error: '서버 오류' });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: '아이디 또는 비밀번호가 일치하지 않습니다.' });
    }
    // findUserSql에서 가져온 쿼리 결과 배열의 첫번째 요소를 user에 저장
    const user = results [0];


    // 비밀번호 검증
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: '아이디 또는 비밀번호가 일치하지 않습니다.' });
    }

    // JWT 토큰 발급
    const payload = {
      user_id: user.user_id,
      login_id: user.login_id,
      username: user.username
    };

    // jwt 토큰 생성, 토큰 만료 시간은 일단 1시간으로 설정💕💕💕추후 로그아웃 시 만료로 리팩터링💕💕💕
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: '로그인 성공', token });
  });
});







// --------------------------------------------------------------------
// 간단한 API 테스트용
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Express server!' });
  });
  
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});