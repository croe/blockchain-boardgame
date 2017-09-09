'use strict';

const http = require('http')
	, express = require('express')
	, path = require('path')
	, app = express()
	, dir = './build/data/' || process.argv[2]
	, fs = require('fs')
	, mongoose = require('mongoose');

const httpsOptions = {
	// key: fs.readFileSync('./key.pem'),
	// cert: fs.readFileSync('./cert.pem')
	key: fs.readFileSync('./keys/server.key'),
	cert: fs.readFileSync('./keys/server.cert')
}


// データ保存
let walk = function(p, callback){
	let results = [];
		
	fs.readdir(p, function (err, files) {
		if (err) throw err;
 
		let pending = files.length;
		if (!pending) return callback(null, results); //全てのファイル取得が終わったらコールバックを呼び出す
		
		files.map(function (file) { //リスト取得
			return path.join(p, file);
		}).filter(function (file) {
			if(fs.statSync(file).isDirectory()) walk(file, function(err, res) { //ディレクトリだったら再帰
				results.push({name:path.basename(file), children:res}); //子ディレクトリをchildrenインデックス配下に保存
				if (!--pending) callback(null, results);
			 });
			return fs.statSync(file).isFile();
		}).forEach(function (file) { //ファイル名を保存
			results.push({file:path.basename(file)});
			if (!--pending) callback(null, results);
		});
		
	});
};
walk(dir, function(err, results) {
	if (err) throw err;
	let data = {name:'root', children:results};
	gifObj = data;
	console.log(JSON.stringify(data)); //一覧出力
});

let gifObj = {};

// 静的ファイル
app.use(express.static(path.join(__dirname, 'build')));

// サーバー始動
let server = https.createServer(httpsOptions,app);
server.listen(3030, () => {
	console.log('https://localhost:3030/');
});

// Mongoose
let Schema = mongoose.Schema;
let UserSchema = new Schema({
  message: String,
  date: Date
});
mongoose.model('User', UserSchema);
mongoose.connect('mongodb://localhost/chat_app');
let User = mongoose.model('User');

// Socket.io
let io = require('socket.io')(server);

io.sockets.on('connection', function(socket){
	socket.on('msg update', function(){
		User.find(function(err, docs){
			socket.emit('msg open', docs);
		})
	});

	console.log('connected');

	socket.on('msg send', function(msg){
		socket.emit('msg push', msg);
		socket.broadcast.emit('msg push', msg);
		let user = new User();
		user.message = msg;
		user.date = new Date();
		user.save(function(err){
			if (err) { console.log(err) }
		})
	})

	socket.on('deleteDB', function(){
		console.log('delete db')
		socket.emit('db drop');
		socket.broadcast.emit('db drop');
		User.remove({message: "test message2!"}, function(err){
			console.log(err)
		});
	})

	socket.on('disconnect', function(){
		console.log('disconnected');
	})

})
