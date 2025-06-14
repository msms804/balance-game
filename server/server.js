const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');

const app = express();
const PORT = 5050;

//CORS 설정
app.use(cors());

// JSON 파싱 가능하도록 설정
app.use(express.json());

// 전달된 인자가 문자열인지, 문자열이라면 앞뒤 공백 제거 후 그 길이가 1 이상인지 체크하는 함수
// 즉 null, number 타입, 빈 문자열 '', 공백만 있는 문자열 '  ' 등은 false를 반환!
function isValidString(str) {
  return typeof str === 'string' && str.trim().length > 0;
}

// POST /api/post : title1 하나 받아서 DB에 insert!
app.post('/api/post', (req, res) => {
  const { title1, title2 } = req.body;

  if (!title1 || !title2) {
    return res.status(400).json({ error: 'title1 and title2 are required' });
  }

  const sql = 'INSERT INTO BalanceGamePost (title1, title2, user_id) VALUES (?, ?, ?)';

  db.query(sql, [title1, title2, 1], (err,result) => {
    if (err) {
      console.error('Insert 실패:', err);
      return res.status(500).json({ error: 'DB 오류' });
    }
    res.status(201).json({ message: 'Insert 성공', post_id: result.insertId });
  });
});


// 간단한 API 테스트용
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Express server!' });
  });
  
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// POST api/signup, 회원가입
app.post('/api/signup', async (req, res) => {
  const { login_id, password, username } = req.body;

  // 요청 바디가 모두 들어왔는지 체크
  if (!isValidString(login_id) || !isValidString.trim(password) || !isValidString.trim(username)) {
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
        return res.status(409).json({ error: '이미 존재하는 로그인 ID입니다.' });
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