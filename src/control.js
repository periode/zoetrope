import * as sender from './sender.js'
import * as panel from './panel.js'

sender.connect();
panel.setup();

function launch(){
  sender.launch();
}


window.launch = sender.launch
