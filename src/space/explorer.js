let exports = module.exports = {};

exports.init = function(){
  setTimeout(setup, 10)
  console.log('EXPLORER: systems init')

  window.addEventListener('click', fullscreen)
  window.addEventListener('keypress', onKeypress)
  window.addEventListener('resize', onWindowResize, false)
}

exports.launch = function(){
  console.log('EXPLORER: launched!')
}


const THREE = require('three')
let space, porthole, renderer, ambient
let porthole_distance = 5
let origin = new THREE.Vector3(0, 0, 0)
let comet

let setup = function  (){
  space = new THREE.Scene()
  space.background = new THREE.Color('black')

  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  porthole = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1600)
  porthole.position.z = porthole_distance

  onWindowResize()
  setupLights()

  let geom = new THREE.SphereGeometry(3, 3, 3)
  let mat = new THREE.MeshBasicMaterial({color: 0xffffff})
  comet = new THREE.Mesh(geom, mat)
  comet.position.x = origin.x
  comet.position.y = origin.y
  comet.position.z = origin.z
  space.add(comet)

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

let onWindowResize = function(){
	porthole.aspect = window.innerWidth/window.innerHeight;
	porthole.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

let onKeypress = (e) => {
  switch (e.key) {
    case " ":
      fullscreen()
      break;
    default:
      setPortholePosition(parseInt(e.key, 12))
      break
  }
}

let setPortholePosition = (index) => {
  if(index > 12)
    throw "invalid porthole position"
  let coeff = map(index, 0, 12, 0, Math.PI*2)

  porthole.position.x = Math.cos(coeff)*porthole_distance
  porthole.position.z = Math.sin(coeff)*porthole_distance

  porthole.lookAt(origin)
}

let map = (val, old_min, old_max, new_min, new_max) => {
  return new_min + (new_max - new_min) * (val - old_min) / (old_max - old_min)
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
