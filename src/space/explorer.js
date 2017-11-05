let exports = module.exports = {};

import vsNoise from '../shaders/noise.vs'
import fsNoise from '../shaders/noise.fs'

exports.init = function(){
  setTimeout(setup, 10)
  console.log('EXPLORER: systems init')

  window.addEventListener('click', fullscreen)
  window.addEventListener('keypress', onKeypress)
  window.addEventListener('resize', onWindowResize, false)
}

exports.launch = () =>{
  console.log('EXPLORER: launched!')
  clock.start()
}

exports.introduce = (_actor) => {
  console.log('introducing', _actor);
  //make current actor go down (using tweening)
  //once past a certain threshold, swap the actor
  //put it back up
  //make it go down to the middle
}

exports.setRotation = (_axis, _value) => {
  console.log('setting rotation:', _axis, _value);
  if(_axis == 'x')
    state.rotation.x = _value
  else if(_axis == 'y')
    state.rotation.y = _value
  else if(_axis == 'z')
    state.rotation.z = _value
  else
    console.log('setRotation: unexpected axis', _axis);
}

exports.setOrbit = (_axis, _value) => {
  console.log('setting orbit:', _axis, _value);
  if(_axis == 'radius')
    state.radius = _value
  else if(_axis == 'offset')
    state.offset = _value
  else
      console.log('setOrbit: unexpected axis', _axis);
}

exports.setSpeed = (_axis, _value) => {
  console.log('setting speed', _axis, _value);
  if(_axis == 'x')
    state.speed.x = _value
  else if(_axis == 'y')
    state.speed.y = _value
  else
    console.log('setSpeed: unexpected axis', _axis);
}

exports.shade = (_shader) => {
  console.log('shading', _shader);
  if(_shader == 'default')
    actor.material = 'default'
  else if(_shader == 'noise')
    actor.material = 'noise'
  else if(_shader == 'stripes')
    actor.material = 'stripes'
}


const THREE = require('three')
const OBJLoader = require('three-obj-loader');
OBJLoader(THREE);

let space, porthole, renderer, ambient
let porthole_distance = 40
let origin = new THREE.Vector3(0, 0, 0)
let comet, logo
let clock

//---------
let actor
let orbit_radius = 0
let state = {
  'speed': 0,
  'rotation': new THREE.Vector3(0, 0, 0),
  'speed': new THREE.Vector3(0, 0, 0),
  'offset': 0,
  'radius': 0
}

let setup = function  (){
  space = new THREE.Scene()
  space.background = new THREE.Color('black')

  clock = new THREE.Clock(false)

  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  porthole = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1600)
  porthole.position.z = porthole_distance

  onWindowResize()
  setupLights()

  let geom = new THREE.SphereGeometry(3, 3, 3)
  let mat = new THREE.MeshBasicMaterial({color: 0xff0000})
  comet = new THREE.Mesh(geom, mat)
  comet.position.x = origin.x
  comet.position.y = origin.y
  comet.position.z = origin.z
  space.add(comet)

  loadShaders()
  // loadObject()

  console.log(comet)
  render()
}

let frag_noise, vert_noise, mat_noise
let frag_perlin, vert_perlin, mat_perlin
let frag_stripes, vert_stripes, mat_stripes
let frag_background, vert_background, mat_background

let loadShaders = () => {
  mat_noise = new THREE.RawShaderMaterial({
    uniforms: {
      uTime:{type: 'f', value: 0.0},
      uVerticalInterval:{type: 'f', value: 50.0},
      uVerticalSpeed:{type: 'f', value: 0.1},
      uIntervalCoeff:{type: 'f', value: 1},
      uIntervalModulo:{type: 'f', value: 100.0},
      uIntervalSpeed:{type: 'f', value: 20.0},
      uBloomSpeed:{type: 'f', value: 0.01},
      uBloomIntensity:{type: 'f', value: 0.001},
      uTanSquaresSize:{type: 'f', value: 0.1},
      uTanSquareModulo:{type: 'f', value: 20.},
      uNoiseDist:{type: 'f', value: 6.0},
      uNoiseSize:{type: 'f', value: 0.05},
      uNoiseSpeed:{type: 'f', value: 0.001},
      uNoiseImpact:{type: 'f', value: 1}
    },
    vertexShader: vsNoise,
    fragmentShader: fsNoise
  })

  comet.material = mat_noise
}

let setupLights = () => {
  var ambient = new THREE.AmbientLight(0xcccccc, 0.2)
  space.add(ambient)

  var point = new THREE.PointLight(0xffffff, 0.8)
  point.position.z = porthole_distance
  point.position.x = porthole_distance*0.5
  porthole.add(point)
  space.add(point)
}

let loadObject = () => {
  let loader = new THREE.OBJLoader()

  loader.load('bundle/assets/obj/OSLogoDJ-straight-straight.obj', (object) => {
    console.log(object);
    for(var i = 0; i < object.children; i++){
      object.children[i].material = new THREE.MeshPhongMaterial({flatShading: true})
    }
    logo = object

    logo.position.x = origin.x
    logo.position.y = origin.y
    logo.position.z = origin.z
    logo.scale.x = 0.2
    logo.scale.y = 0.2
    logo.scale.z = 0.2
    logo.rotation.y = Math.PI/2

    space.add(logo)
  })
}

let animate = () => {
  if(logo != undefined){
    logo.position.x = Math.cos(clock.getElapsedTime()*0.1)*orbit_radius
    logo.position.z = Math.sin(clock.getElapsedTime()*0.1)*orbit_radius
    // for(var i = 0; i < logo.children.length; i++){
      logo.lookAt(origin)
    // }
    // logo.rotation.x = Math.PI/2
  }

  comet.material.uniforms.uTime.value = clock.getElapsedTime();

}

let render = function(){
  animate()
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
