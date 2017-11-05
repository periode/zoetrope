import * as sender from './sender'
import * as panel from './panel'

sender.connect();
panel.setup();

window.launch = sender.launch
window.introduce = sender.introduce
window.setParameter = sender.setParameter
window.shade = sender.shade
