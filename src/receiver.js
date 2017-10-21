let exports = module.exports = {};

const SOCKET_SERVER = "localhost:2046";
const io = require('socket.io-client');

let explorer = require('./explorer.js')

exports.init = function(){
  this.socket = io(SOCKET_SERVER);

  this.socket.on('connect', function(){
    console.log('RECEIVER: connected');
  });

  this.socket.on('launch', function(){
    console.log('RECEIVER: received launch command...');
    explorer.launch();
  });
}
