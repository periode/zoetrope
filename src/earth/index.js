import * as sender from './sender'
import * as panel from './panel'

sender.connect();
panel.setup();

function launch(){
  sender.launch();
}


window.launch = sender.launch
