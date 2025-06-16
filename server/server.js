const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');
const jwt = require('jsonwebtoken');
const { isValidString, checkPostExists } = require('./utils');
const { verifyToken } = require('./middleware/auth');
const JWT_SECRET = 'hello_our_agv_age_is_30.5yrs_old'

const app = express();
const PORT = 5050;

//CORS 설정
app.use(cors());

// JSON 파싱 가능하도록 설정
app.use(express.json());

// 🌹인증필요🌹 POST /api/post, 게시글 등록: title1, title2 받아서 BalanceGamePost 테이블에 삽입 
app.post('/api/post', verifyToken, (req, res) => {
  const { title1, title2 } = req.body;  //req.body 객체에서 title1, title2 속성 추출 -> 객체 디스트럭처링 문법

  if (!isValidString(title1) || !isValidString(title2)) {
    return res.status(400).json({ error: 'title1과 title2를 모두 입력해주세요.' });
  }
  
  //user_id를 JWT 토큰에서 추출한 값으로 대체함
  const userIdFromToken = req.user.user_id;

  const insertPostSql = 'INSERT INTO BalanceGamePost (title1, title2, user_id) VALUES (?, ?, ?)';

  db.query(insertPostSql, [title1, title2, userIdFromToken], (err,result) => {
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
    const checkUserSql = 'SELECT * FROM Users WHERE login_id = ?';
    db.query(checkUserSql, [login_id], async (err, results) => {
      if (err) {
        console.error('DB 오류:', err);
        return res.status(500).json({error: 'DB 오류'});
      }

      if (results.length > 0) {
        // login_id 중복
        return res.status(409).json({ error: '이미 존재하는 ID입니다.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const insertUserDataSql = 'INSERT INTO Users (login_id, password, username) VALUES (?, ?, ?)';
      db.query(insertUserDataSql, [login_id, hashedPassword, username], (err, result) => {
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

    // jwt 토큰 생성, 토큰 만료 시간은 일단 1시간으로 설정 🌹🌹🌹추후 로그아웃 시 만료로 리팩터링🌹🌹🌹
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: '로그인 성공', token });
  });
});

// 🌹인증필요🌹 POST /api/comment, 댓글 작성
app.post('/api/comment', verifyToken, async (req, res) => {
  const { post_id, comment } = req.body;
  const userIdFromToken = req.user.user_id;

  // 클라이언트가 post_id 값을 보냈는지 확인, commet에 장난질은 치지 않았는지 유효성 검사
  if (!post_id || !isValidString(comment)) {
    return res.status(400).json({ error: '클라이언트측에서 post_id가 존재하지 않거나 comment를 입력하지 않았습니다.' });
  }
  try {
    const exists = await checkPostExists(post_id);
    if (!exists) {
      return res.status(404).json({ error: '해당 게시글이 존재하지 않습니다.' });
    }
    const insertCommentSql = 'INSERT INTO Comment (post_id, user_id, comment) VALUES (?, ?, ?)';

    db.query(insertCommentSql, [post_id, userIdFromToken, comment], (err, result) => {
      if (err) {
        console.error('댓글 작성 실패:', err);
        return res.status(500).json({ error: '댓글 작성 실패(DB 오류)' });
      }
      res.status(201).json({ message: '댓글 등록 성공', comment_id: result.insertId });
    });
  } catch (err) {
    console.error('댓글 작성 중 서버 오류:', err);
    res.status(500).json({ error: '서버 내부 오류 발생' });
  }
});

// 🌹인증필요🌹 POST /api/vote, 투표 등록
app.post('/api/vote', verifyToken, async (req, res) => {
  const { post_id, choice } = req.body;
  const userIdFromToken = req.user.user_id;

  // choice는 반드시 msg1 or msg2 중 하나여야 함
  if (!post_id || (choice !== 'msg1' && choice !== 'msg2')) {
    return res.status(400).json({ error: '클라이언트측에서 post_id가 존재하지 않거나 msg1 또는 msg2를 선택하지 않았습니다.' });
  }

  try {
    const exists = await checkPostExists(post_id);
    if (!exists) {
      return res.status(404).json({ error: '해당 게시글이 존재하지 않습니다.' });
    }

    // 해당 post_id에 대해 사용자가 투표했는지 체크
    const checkDuplicateVoteSql = 'SELECT * FROM Vote WHERE post_id = ? AND user_id = ?';
    db.query(checkDuplicateVoteSql, [post_id, userIdFromToken], (err, results) => {
      if (err) {
        console.error('중복 투표 확인 실패:', err);
        return res.status(500).json({ error: 'DB 오류로 투표 확인에 실패했습니다.' });
      }
      if (results.length > 0) {
        return res.status(409).json({ error: '이미 이 게시글에 투표하셨습니다.' });
      }

      // 투표 삽입 SQL
      const insertVoteSql = 'INSERT INTO Vote (post_id, user_id, choice) VALUES (?, ?, ?)';
      db.query(insertVoteSql, [post_id, userIdFromToken, choice], (err, result) => {
        if (err) {
          console.error('투표 등록 실패:', err);
          return res.status(500).json({ error: '투표 등록 실패(DB 오류)' });
        }
        res.status(201).json({ success: true });
      });
    });
  } catch (err) {
    console.error('투표 처리 중 서버 오류:', err);
    res.status(500).json({ error: '서버 내부 오류 발생' });
  }
});

// GET /api/posts, 전체 게시글 조회
app.get('/api/posts', (req, res) => {
  // 참고로 title1은... msg1으로 바뀔 수도 있음
  const getAllPostsSql = `
    SELECT
      p.post_id AS postId,
      p.title1 AS msg1,
      p.title2 AS msg2,
      p.created_at AS time,
      u.username
    FROM BalanceGamePost p
    JOIN Users u ON p.user_id = u.user_id
    ORDER BY p.created_at DESC
  `;
  db.query(getAllPostsSql, (err, results) => {
    if (err) {
      console.error('게시글 조회 실패:', err);
      return res.status(500).json({ error: '게시글 조회 실패(DB 오류)' });
      }
      res.status(200).json({ success: true, posts: results });
    });
});







// --------------------------------------------------------------------
// 간단한 API 테스트용
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Express server!' });
  });

// JSON 문법 에러 핸들러
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('JSON 문법 오류:', err.message);
    return res.status(400).json({ error: '잘못된 JSON 형식입니다.' });
  }
  next();
});
  
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});