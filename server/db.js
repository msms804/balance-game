const mysql = require('mysql2');

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'balance_game_db'
// });

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT
});

connection.connect((err) => {
    if (err) {
        console.error('MySQL 연결 실패:', err);
    }
    else {
        console.log('MySQL 연결 성공!!!');
    }
});

module.exports = connection;

