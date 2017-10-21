let exports = module.exports = {};

exports.init = function(){
  setTimeout(setup, 10)
  console.log('EXPLORER: systems init');
}

exports.launch = function(){
  console.log('EXPLORER: launched!');
}


const THREE = require('three')
let space, porthole, renderer, ambient
let comet

function setup(){
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
  space.add(comet)

  console.log(comet)
  render()
}

function setupLights(){
  var ambient = new THREE.AmbientLight();
  space.add(ambient);
}

var render = function(){
  requestAnimationFrame(render);

  renderer.render(space, porthole);
}
