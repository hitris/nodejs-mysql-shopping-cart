var mysql = require('mysql'),
	config = require('./config.json');
delete config.database;

var connection = mysql.createConnection(config);

connection.connect();

connection.on('error', function (err) {
	console.log(err);
});


//创建数据库
connection.query('CREATE DATABASE IF NOT EXISTS `cart-example`');

//切换到cart-example表
connection.query('USE `cart-example`');

//创建item表
connection.query('DROP TABLE IF EXISTS item');
connection.query('CREATE TABLE item (' +
	'id INT(11) AUTO_INCREMENT,' +
	'title VARCHAR(255),' +
	'description TEXT,' +
	'created DATETIME,' +
	'PRIMARY KEY (id))');

//创建review表
connection.query('DROP TABLE IF EXISTS review');
connection.query('CREATE TABLE review (' +
	'id INT(11) AUTO_INCREMENT,' +
	'item_id INT(11),' +
	'text TEXT,' +
	'stars INT(1),' +
	'created DATETIME,' +
	'PRIMARY KEY(id))');

//退出数据库连接
connection.end();