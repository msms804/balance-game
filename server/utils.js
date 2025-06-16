const db = require('./db');
const { uniqueNamesGenerator } = require('unique-names-generator');
const adjectives = ['귀여운', '멋진', '빠른', '행복한', '졸린', '배고픈', '화난'];
const animals = ['고양이', '호랑이', '여우', '토끼', '곰', '강아지'];


// 전달된 인자가 문자열인지, 문자열이라면 앞뒤 공백 제거 후 그 길이가 1 이상인지 체크하는 함수
// 즉 null, number 타입, 빈 문자열 '', 공백만 있는 문자열 '  ' 등은 false를 반환!
function isValidString(str) {
  return typeof str === 'string' && str.trim().length > 0;
}

// post_id 존재 여부 확인 함수: 해당 게시글이 존재하는지 DB에서 확인
function checkPostExists(post_id) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT 1 FROM BalanceGamePost WHERE post_id = ? LIMIT 1';
    db.query(sql, [post_id], (err, results) => {
      if (err) return reject(err);
      resolve(results.length > 0);
    });
  });
}

function generateRandomNickname() {
  const name = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: '-',
  });
  
  const randomNumber = Math.floor(Math.random() * 1000);
  return `${name}${randomNumber}`;
}

module.exports = {
  isValidString,
  checkPostExists,
  generateRandomNickname
};