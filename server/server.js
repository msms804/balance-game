require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');
const jwt = require('jsonwebtoken');
const { isValidString, checkPostExists } = require('./utils');
const { verifyToken } = require('./middleware/auth');
const JWT_SECRET = process.env.JWT_SECRET;
const { generateRandomNickname } = require('./utils');

const app = express();
// const PORT = process.env.PORT;
const PORT = process.env.PORT || 5050;

//CORS 설정!
app.use(cors());

// JSON 파싱 가능하도록 설정
app.use(express.json());

// 🌹인증필요🌹 POST /api/post, 게시글 등록: maintitle, title1, title2 받아서 BalanceGamePost 테이블에 삽입 
app.post('/api/post', verifyToken, (req, res) => {
  const { maintitle, title1, title2 } = req.body;  //req.body 객체에서 maintitle, title1, title2 속성 추출 -> 객체 디스트럭처링 문법

  if (!isValidString(maintitle) || !isValidString(title1) || !isValidString(title2)) {
    return res.status(400).json({ error: 'maintitle, title1, title2를 모두 입력해주세요.' });
  }
  
  //user_id를 JWT 토큰에서 추출한 값으로 대체함
  const userIdFromToken = req.user.user_id;

  const insertPostSql = 'INSERT INTO BalanceGamePost (main_title, title1, title2, user_id) VALUES (?, ?, ?, ?)';

  db.query(insertPostSql, [maintitle, title1, title2, userIdFromToken], (err, result) => {
    if (err) {
      console.error('Insert 실패:', err);
      return res.status(500).json({ error: 'DB 오류' });
    }
    res.status(201).json({ success: true, post_id: result.insertId });
  });
});


// POST api/signup, 회원가입
app.post('/api/signup', async (req, res) => {
  const { login_id, password } = req.body;

  // 요청 바디가 모두 들어왔는지 체크
  if (!isValidString(login_id) || !isValidString(password)) {
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
      const randomNickname = generateRandomNickname();

      const insertUserDataSql = 'INSERT INTO Users (login_id, password, username) VALUES (?, ?, ?)';
      db.query(insertUserDataSql, [login_id, hashedPassword, randomNickname], (err, result) => {
        if (err) {
          console.error('회원가입 실패:', err);
          return res.status(500).json({ error: '회원가입 실패' });
        }
        res.status(201).json({ success: true, user_id: result.insertId });
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

    res.status(200).json({ success: true, token, username: user.username });
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
      res.status(201).json({ success: true, comment_id: result.insertId });
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
      p.main_title AS maintitle,
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


// GET /api/post/:postId, 게시글 상세 조회
// response -> { postId, maintitle, msg1, msg2, username, time, votes: { msg1, msg2 } }
app.get('/api/post/:postId', (req, res) => {
  const postId = req.params.postId;

  // postId가 숫자가 아니면 에러 처리
  if (isNaN(postId)) {
    return res.status(400).json({ error: '유효하지 않은 postId 형식' });
  }

  // 게시글 정보 조회
  const getPostSql = `
    SELECT
      p.post_id AS postId,
      p.main_title AS maintitle,
      p.title1 AS msg1,
      p.title2 AS msg2,
      p.created_at AS time,
      u.username
    FROM BalanceGamePost p
    JOIN Users u ON p.user_id = u.user_id
    WHERE p.post_id = ?
  `;

  db.query(getPostSql, [postId], (err, postResult) => {
    if (err) {
      console.error('게시글 조회 오류', err);
      return res.status(500).json({ error: '게시글 조회 실패(DB 오류)' });
    }
    if (postResult.length === 0) {
      return res.status(404).json({ error: '해당 게시글이 존재하지 않습니다.' });
    }

    const post = postResult[0];

    const countVoteSql = `
      SELECT
        choice,
        COUNT(*) AS count
      FROM Vote
      WHERE post_id = ?
      GROUP BY choice
    `;

    db.query(countVoteSql, [postId], (err, voteResults) => {
      if (err) {
        console.error('투표수 집계 실패', err);
        return res.status(500).json({ error: '투표수 집계 실패(DB 오류)' });
      }

      // 투표수 초기화
      const votes = {
        msg1: 0,
        msg2: 0
      };

      voteResults.forEach(row => {
        if (row.choice === 'msg1') votes.msg1 = row.count;
        if (row.choice === 'msg2') votes.msg2 = row.count;
      });

      res.status(200).json({
        postId: post.postId,
        maintitle: post.maintitle,
        msg1: post.msg1,
        msg2: post.msg2,
        username: post.username,
        time: post.time,
        votes
      });
    });
  });
});

// GET /api/vote/:postId, 특정 게시글의 투표 결과 조회
// response -> { postId, msg1Count, msg2Count }
app.get('/api/vote/:postId', (req, res) => {
  const postId = req.params.postId;

  if (isNaN(postId)) {
    return res.status(400).json({ error: '유효하지 않은 postId 형식' });
  }

  checkPostExists(postId).then(exists => {
    if (!exists) {
      return res.status(404).json({ error: '해당 게시글이 존재하지 않습니다.' });
    }

    const countVoteSql = `
      SELECT
      SUM(CASE WHEN choice = 'msg1' THEN 1 ELSE 0 END) AS msg1Count,
      SUM(CASE WHEN choice = 'msg2' THEN 1 ELSE 0 END) AS msg2Count
    FROM Vote
    WHERE post_id = ?
  `;

    db.query(countVoteSql, [postId], (err, result) => {
      if (err) {
        console.error('투표 결과 조회 실패:', err);
        return res.status(500).json({ error: '투표 결과 조회 실패(DB 오류)' });
      }

      let row;
      if (result.length > 0) {
        row = result[0];
      }
      else {
        row = { msg1Count: 0, msg2Count: 0 };
      }
      res.status(200).json({
        postId: Number(postId),
        msg1Count: row.msg1Count,
        msg2Count: row.msg2Count
      });
    });
  }).catch(err => {
    console.error('post 존재 여부 확인 실패', err);
    return res.status(500).json({ error: 'post 존재 여부 확인 실패(DB 오류)' });
  });
});

// GET api/comment/:commentId, 댓글 조회
// [ { commentId, userId, comment, time } ]
app.get('/api/comments/:postId', (req, res) => {
  const postId = req.params.postId;

  if (isNaN(postId)) {
    return res.status(400).json({ error: '유효하지 않은 postId 형식' });
  }

  const getCommentsSql = `
    SELECT
      c.comment_id AS commentId,
      c.user_id AS userId,
      u.username AS userName,
      c.comment,
      c.created_at AS time
      FROM Comment c
      JOIN Users u ON c.user_id = u.user_id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
  `;

  db.query(getCommentsSql, [postId], (err, results) => {
    if (err) {
      console.err('댓글 조회 실패:', err);
      return res.status(500).json({ error: 'post 존재 여부 확인 실패(DB 오류)' });
    }
    res.status(200).json({ posts: results });
  });
});

// DELETE /api/post/:postId, 게시글 삭제
app.delete('/api/post/:postId', async (req, res) => {
  const postId = req.params.postId;

  if (!postId || isNaN(postId)) {
    return res.status(400).json({ error: 'postId가 존재하지 않거나 유효하지 않습니다.' });
  }

  try {
    const exists = await checkPostExists(postId);
    if (!exists) {
      return res.status(404).json({ error: '해당 게시글이 존재하지 않습니다.' });
    }

    const deletePostSql = 'DELETE FROM BalanceGamePost WHERE post_id = ?';
    db.query(deletePostSql, [postId], (err, result) => {
      if (err) {
        console.error('게시글 삭제 실패:', err);
        return res.status(500).json({ error: '게시글 삭제 실패(DB 오류)' });
      }
      res.status(200).json({ success: true });
    });
  } catch (err) {
    console.error('게시글 삭제 중 서버 오류', err);
    res.status(500).json({ error: '서버 내부 오류 발생' });
  }
});


// DELETE /api/comment/:commentId, 댓글 삭제
app.delete('/api/comment/:commentId', (req, res) => {
  const commentId = req.params.commentId;

  if (!commentId || isNaN(commentId)) {
    return res.status(400).json({ error: 'commentId가 존재하지 않거나 유효하지 않습니다.' });
  }

  const deleteCommentSql = 'DELETE FROM Comment WHERE comment_id = ?';

  db.query(deleteCommentSql, [commentId], (err, result) => {
    if (err) {
      console.error('댓글 삭제 실패:', err);
      return res.status(500).json({ error: '댓글 삭제 실패(DB 오류)' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '해당 댓글이 존재하지 않습니다.' });
    }
    res.status(200).json({ success : true });
  });
});

/////// 권민성 추가 /////////
app.get('/api/vote/:postId/:userId', (req, res) => {
  const postId = req.params.postId;
  const userId = req.params.userId;
  const checkVoteSql = 'SELECT choice FROM Vote WHERE post_id = ? AND user_id = ?';
  db.query(checkVoteSql, [postId, userId], (err, results) => {
    if (err) {
      console.error('투표 확인 오류', err);
      return res.status(500).json({ error: 'DB 오류' });
    }
    if (results.length > 0) {
      return res.status(200).json({ voted: true, choice: results[0].choice });
    } else {
      return res.status(200).json({ voted: false });
    }
  });
});



// ---------------------------------------------------------------------
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