let exports = module.exports = {};
//adhoc: 169.254.110.10
//wifi: 169.225.32.166
const SOCKET_SERVER = "169.254.110.10:2046";
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
