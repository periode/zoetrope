let exports = module.exports = {};
//adhoc: 169.254.110.10
//wifi: 169.225.32.166
// const SOCKET_SERVER = "169.254.110.10:2046";
const SOCKET_SERVER = "169.254.110.10"
const io = require('socket.io-client');
let socket

let explorer = require('./explorer.js')

exports.init = () =>{
  socket = io.connect(SOCKET_SERVER);

  socket.on('connect', () => {
    console.log('RECEIVER: connected');
  })

  socket.on('launch', () => {
    console.log('RECEIVER: received launch command...')
    explorer.launch();
  })

  socket.on('introduce', (actor) => {
    console.log('RECEIVER: introducing',actor)
    explorer.introduce(actor)
  })

  socket.on('set', (data) => {
    if(data.group == 'rotation')
      explorer.setRotation(data.axis, data.value)
    else if(data.group == 'orbit')
      explorer.setOrbit(data.axis, data.value)
    else if(data.group == 'speed')
      explorer.setSpeed(data.axis, data.value)
  })

  socket.on('shade', (shader) => {
    console.log('RECEIVER: received shade command for', shader);
  });
}
