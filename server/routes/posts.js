const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const db = require('../db');
const { isValidString, checkPostExists } = require('../utils');

// 🌹인증필요🌹 POST /api/post, 게시글 등록: maintitle, title1, title2 받아서 BalanceGamePost 테이블에 삽입 
router.post('/api/post', verifyToken, (req, res) => {
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



// GET /api/posts, 전체 게시글 조회
router.get('/api/posts', (req, res) => {
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
router.get('/api/post/:postId', (req, res) => {
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


// DELETE /api/post/:postId, 게시글 삭제
router.delete('/api/post/:postId', async (req, res) => {
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

module.exports = router;