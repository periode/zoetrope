let exports = module.exports = {};

const SOCKET_SERVER = "localhost:2046";
const io = require('socket.io-client');
let socket

exports.connect = function(){
  socket = io(SOCKET_SERVER);

  socket.on('connect', function(){
    console.log('SENDER: connected');
  });
}

exports.launch = function(){
  console.log('SENDER: requesting launch');
  socket.emit('launch');
}
