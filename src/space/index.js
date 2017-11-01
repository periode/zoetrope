import * as receiver from './receiver';
import * as explorer from './explorer';

receiver.init();
explorer.init();

let start = function(){
  console.log('emitting launch');
  receiver.socket.emit('launch');
}

window.fullscreen = explorer.fullscreen
