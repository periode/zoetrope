let exports = module.exports = {};

// const SOCKET_SERVER = "localhost:2046";
const SOCKET_SERVER = "169.254.110.10";

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

exports.introduce = (actor) => {
  socket.emit('introduce', actor)
}

exports.setParameter = (g, p, v) => {
  socket.emit('set', {group:g, axis: p, value: v})
}

exports.shade = (s) => {
  socket.emit('shade', s)
}
