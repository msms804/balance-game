const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

//CORS 설정
app.use(cors())

// JSON 파싱 가능하도록 설정
app.use(express.json());


// 간단한 API 테스트용
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Express server!' });
  });
  
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});