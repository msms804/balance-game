const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 5050;

//CORS 설정
app.use(cors());

// JSON 파싱 가능하도록 설정
app.use(express.json());

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