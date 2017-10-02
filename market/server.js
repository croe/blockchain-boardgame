'use strict';

const http = require('http')
  , express = require('express')
  , app = express()
  , mongoose = require('mongoose');

// サーバー始動
let server = http.createServer(app);
server.listen(3030, () => {
  console.log('https://localhost:3030/');
});

// Mongoose
let Schema = mongoose.Schema;
// Market asset
let MAssetSchema = new Schema({
  player: Number,
  asset: Number,
  amount: Number,
  value: Number,
  isSoldout: Boolean,
  isCancel: Boolean,
  date: Date
})
mongoose.model('MAsset', MAssetSchema);
mongoose.connect('mongodb://localhost/market_app');
let MAsset = mongoose.model('MAsset');
// Player
let UserSchema = new Schema({
  player: Number,
  balance: Number,
  assetsBalance: []
})
mongoose.model('User', UserSchema);
mongoose.connect('mongodb://localhost/user');
let User = mongoose.model('User');

// Socket.io
let io = require('socket.io')(server);

io.sockets.on('connection', function (socket) {
  socket.on('msg update', function () {
    MAsset.find(function (err, docs) {
      socket.emit('msg open', docs);
    })
    User.find(function (err, docs) {
      socket.emit('msg open', docs);
    })
  });

  console.log('connected');

  socket.on('msg send', function (msg) {
    socket.emit('msg push', msg);
    socket.broadcast.emit('msg push', msg);
    let masset = new MAsset();
    masset.player = msg.p;
    masset.asset = msg.a;
    masset.amount = msg.m;
    masset.value = msg.v;
    masset.isSoldout = msg.so;
    masset.isCancel = msg.ca;
    masset.date = new Date();
    masset.save(function (err) {
      if (err) {
        console.log(err)
      } else {
        MAsset.find(function (err, docs) {
          socket.emit('msg refresh', docs);
          socket.broadcast.emit('msg refresh', docs);
        })
      }
    })
  })

  socket.on('msg soldout', function (msg) {
    MAsset.update({_id: msg}, {isSoldout: true}, function (err) {
      if (err) {
        console.log(err)
      } else {
        MAsset.find(function (err, docs) {
          socket.emit('msg refresh', docs);
          socket.broadcast.emit('msg refresh', docs);
        })
      }
    });
  })

  socket.on('msg reset market', function () {
    MAsset.remove({isSoldout: true}, function (err) {
      console.log('delete market');
    })
    MAsset.remove({isSoldout: false}, function (err) {
      console.log('delete market');
    })
  });

  socket.on('deleteDB', function () {
    console.log('delete db')
    socket.emit('db drop');
    socket.broadcast.emit('db drop');
    User.remove({player: 0}, function (err) {
      console.log(err)
    });
    User.remove({player: 1}, function (err) {
      console.log(err)
    });
    User.remove({player: 2}, function (err) {
      console.log(err)
    });
    User.remove({player: 3}, function (err) {
      console.log(err)
    });
    User.remove({player: 4}, function (err) {
      console.log(err)
    });
    User.remove({player: 5}, function (err) {
      console.log(err)
    });
    User.remove({player: 6}, function (err) {
      console.log(err)
    });
    User.remove({player: 7}, function (err) {
      console.log(err)
    });
    User.remove({player: 8}, function (err) {
      console.log(err)
    });
  })

  socket.on('send coin', function (msg) {
    User.find({player: msg.from}, function (err, _from) {
      User.find({player: msg.to}, function (err, _to) {
        if (_from[0].balance >= msg.val && _from[0].player !== _to[0].player) {
          _from[0].update({balance: _from[0].balance - parseFloat(msg.val)}, function (err) {
            _to[0].update({balance: _to[0].balance + parseFloat(msg.val)}, function (err) {
              socket.emit('send res');
              socket.broadcast.emit('send res');
            });
          });
        }
      })
    })
  })

  socket.on('send asset', function (msg) {
    User.find({player: msg.from}, function (err, _from) {
      if (_from[0].assetsBalance[msg.ind] === null || _from[0].assetsBalance[msg.ind] === undefined) {
        _from[0].assetsBalance[msg.ind] = 0;
      }
      User.find({player: msg.to}, function (err, _to) {
        if (_to[0].assetsBalance[msg.ind] === null || _to[0].assetsBalance[msg.ind] === undefined) {
          _to[0].assetsBalance[msg.ind] = 0;
        }
        if (_from[0].assetsBalance[msg.ind] >= msg.val && _from[0].player !== _to[0].player) {
          _from[0].assetsBalance[msg.ind] = _from[0].assetsBalance[msg.ind] - parseFloat(msg.val);
          _to[0].assetsBalance[msg.ind] = _to[0].assetsBalance[msg.ind] + parseFloat(msg.val);
          _from[0].save();
          _to[0].save();
          _from[0].update({assetsBalance: _from[0].assetsBalance}, function (err) {
            _to[0].update({assetsBalance: _to[0].assetsBalance}, function (err) {
              console.log(_from[0].assetsBalance, _to[0].assetsBalance)
              socket.emit('send res');
              socket.broadcast.emit('send res');
            })
          })
        }
      })
    })
  })

  socket.on('balance refresh', function () {
    User.find(function (err, doc) {
      socket.emit('balance res', doc);
      socket.broadcast.emit('balance res', doc);
    })
  })

  socket.on('get asset for market', function (msg) {
    User.find({player: msg}, function (err, doc) {
      socket.emit('')
    })
  })

  socket.on('init player', function (msg) {
    User.find({player: msg}, function (err, docs) {
      socket.emit('inited player', docs[0]);
    })
  })

  socket.on('init userdb', function (msg) {
    user0.save(function (err) {
      user1.save(function (err) {
        user2.save(function (err) {
          user3.save(function (err) {
            user4.save(function (err) {
              user5.save(function (err) {
                user6.save(function (err) {
                  user7.save(function (err) {
                    user8.save(function (err) {
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  })

  socket.on('disconnect', function () {
    console.log('disconnected');
  })

})

let user0 = new User();
user0.player = 0;
user0.balance = 10000;
user0.assetsBalance = [10000, 10000, 10000, 10000, 10000, 10000];

let user1 = new User();
user1.player = 1;
user1.balance = 90;
user1.assetsBalance = [5.0, 0.0, 0.0, 0.0, 0.0, 0.0];

let user2 = new User();
user2.player = 2;
user2.balance = 95;
user2.assetsBalance = [0.0, 2.0, 0.0, 0.0, 0.0, 0.0];

let user3 = new User();
user3.player = 3;
user3.balance = 100;
user3.assetsBalance = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];

let user4 = new User();
user4.player = 4;
user4.balance = 95;
user4.assetsBalance = [0.0, 0.0, 0.0, 3.0, 0.0, 0.0];

let user5 = new User();
user5.player = 5;
user5.balance = 90;
user5.assetsBalance = [0.0, 3.2, 0.0, 0.0, 1.6, 2.0];

let user6 = new User();
user6.player = 6;
user6.balance = 87;
user6.assetsBalance = [3.0, 0.0, 3.0, 0.0, 3.0, 0.0];

let user7 = new User();
user7.player = 7;
user7.balance = 87;
user7.assetsBalance = [2.0, 3.0, 4.0, 0.0, 0.0, 0.0];

let user8 = new User();
user8.player = 8;
user8.balance = 95;
user8.assetsBalance = [0.0, 0.0, 0.0, 0.0, 0.0, 3.0];
