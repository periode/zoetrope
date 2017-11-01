import * as sender from './sender'
import * as panel from './panel'

sender.connect();
panel.setup();

let launch = function(){
  sender.launch();
}


window.launch = sender.launch
