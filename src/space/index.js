import * as receiver from './receiver';
import * as explorer from './explorer';

receiver.init();
explorer.init();

window.fullscreen = explorer.fullscreen
