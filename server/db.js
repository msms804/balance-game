const mysql = require('mysql2');

const conection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'balance_game_db'
});

conection.connect((err) => {
    if (err) {
        console.error('MySQL 연결 실패:', err);
    }
    else {
        console.log('MySQL 연결 성공!!!');
    }
});

module.exports = conection;