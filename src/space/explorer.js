let exports = module.exports = {};

exports.init = function(){
  setTimeout(setup, 10)
  console.log('EXPLORER: systems init')

  window.addEventListener('click', fullscreen)
  window.addEventListener('keypress', fullscreen)
}

exports.launch = function(){
  console.log('EXPLORER: launched!')
}


const THREE = require('three')
let space, porthole, renderer, ambient
let comet

let setup = function  (){
  space = new THREE.Scene()
  space.background = new THREE.Color('black')

  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  porthole = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1600)
  porthole.position.z = 5

  setupLights()

  let geom = new THREE.SphereGeometry(3, 3, 3)
  let mat = new THREE.MeshBasicMaterial({color: 0xffffff})
  comet = new THREE.Mesh(geom, mat)


  console.log(comet)
  render()
}

let setupLights = function(){
  var ambient = new THREE.AmbientLight();
  space.add(ambient);
}

let render = function(){
  requestAnimationFrame(render);

  renderer.render(space, porthole);
}

let fullscreen = function(){
  if ((document.fullScreenElement && document.fullScreenElement !== null) ||
   (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if (document.documentElement.requestFullScreen) {
      document.documentElement.requestFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
      document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}
