var express = require('express'),
	mysql = require('mysql'),
	pug = require('pug'),
	config = require('./config.json'),
	bodyParser = require('body-parser');
var app = express();
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.set('view options', {layout: false});

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({extended: false});


var connection = mysql.createConnection(config);

connection.connect();

//首页
app.get('/', function (req, res, next) {
	connection.query('SELECT id,title,description FROM item', function (err, results) {
		if (err) return next(err);
		console.log(results);
		res.render('index', {items: results});
	});
});

//创建商品
app.post('/create', urlencodedParser, function (req, res, next) {
	connection.query('INSERT INTO item SET title = ?,description = ?',
		[req.body.title, req.body.description], function (err, info) {
			if (err) return next(err);
			console.log('-item created with id %s', info.insertId);
			res.redirect('/')
		}
	)
});

//查看商品
app.get('/item/:id', function (req, res, next) {
	function getItem(fn) {
		connection.query('SELECT id,title,description FROM item WHERE id= ? LIMIT 1',
			[req.params.id], function (err, results) {
				if (err) return next(err);
				if (!results[0]) return res.send(404);
				fn(results[0]);
			}
		)
	}

	function getReviews(item_id, fn) {
		connection.query('SELECT text, stars FROM review WHERE item_id = ?',
			[item_id], function (err, results) {
				if (err) return next(err);
				fn(results);
			}
		)
	}

	getItem(function (item) {
		getReviews(item.id, function (reviews) {
			res.render('item', {item: item, reviews: reviews})
		})
	})
});

//创建评价
app.post('/item/:id/review', urlencodedParser, function (req, res, next) {
	connection.query('INSERT INTO review SET item_id = ?, stars= ?, text= ?',
		[req.params.id, req.body.stars, req.body.text], function (err, info) {
			if (err) return next(err);
			console.log('-review created with id %s', info.insertId);
			res.redirect('/item/' + req.params.id)
		}
	)
});

app.listen(3000, function () {
	console.log(' - listening on http://*:3000')
});


