const jwt = require('jsonwebtoken');
const JWT_SECRET = 'hello_our_agv_age_is_30.5yrs_old'

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

module.exports = { verifyToken };