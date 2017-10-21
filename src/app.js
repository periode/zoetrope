import * as receiver from './receiver.js';
import * as explorer from './explorer';

receiver.init();
explorer.init();

let start = function(){
  console.log('emitting launch');
  receiver.socket.emit('launch');
}
