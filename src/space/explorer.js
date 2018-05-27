let exports = module.exports = {};

import vsNoise from '../shaders/noise.vs'
import fsNoise from '../shaders/noise.fs'
import vsStripes from '../shaders/stripes.vs'
import fsStripes from '../shaders/stripes.fs'
import vsBasic from '../shaders/basic.vs'
import fsBasic from '../shaders/basic.fs'
import vsPerlin from '../shaders/perlin.vs'
import fsPerlin from '../shaders/perlin.fs'

exports.init = function(){
  setTimeout(setup, 10)
  console.log('EXPLORER: systems init')

  window.addEventListener('click', fullscreen)
  window.addEventListener('keypress', onKeypress)
  window.addEventListener('resize', onWindowResize, false)
}

let radius
let launched =  false
exports.launch = () =>{
  console.log('EXPLORER: launched!')
  launched = true
  clock.start()
}

exports.introduce = (_actor) => {
  //make current actor go down (using tweening)
  //once past a certain threshold, swap the actor
  //put it back up
  //make it go down to the middle


for(var i = 0; i < meshes.length; i++){
  meshes[i].visible = false;
}

  if(_actor == 'logo'){
    // removeAllObjects()
    // actor.add(logo)
    logo.visible = !logo.visible
    if(logo.visible)
      actor = logo
  }

  if(_actor == 'cube'){
    cube.visible = !cube.visible
    if(cube.visible)
      actor = cube
  }

  if(_actor == 'sphere'){
    sphere.visible = !sphere.visible
    if(sphere.visible)
      actor = sphere
  }

  if(_actor == 'torus'){
    torus.visible = !torus.visible
    if(torus.visible)
      actor = torus
  }

  if(_actor == 'isocahedron'){
    ico.visible = !ico.visible
    if(ico.visible)
      actor = ico
  }

  if(_actor == 'mult_cube'){
    removeAllObjects()
    actor.add(mult_cube)
  }

  if(_actor == 'mult_sphere'){
    removeAllObjects()
    actor.add(mult_sphere)
  }

  if(_actor == 'mult_ico'){
    removeAllObjects()
    actor.add(mult_ico)
  }

  if(_actor == 'mult_torus'){
    removeAllObjects()
    actor.add(mult_torus)
  }
}

exports.setRotation = (_axis, _value) => {
  console.log(_axis);
  if(_axis == 'x')
    state.rotation.x += _value * 0.001
  else if(_axis == 'y')
    state.rotation.y += _value * 0.001
  else if(_axis == 'z')
    state.rotation.z += _value * 0.001
  else
    console.log('setRotation: unexpected axis', _axis);
    console.log(state.rotation);
}

exports.setOrbit = (_axis, _value) => {
  if(_axis == 'radius')
    state.radius += _value * 1.5
  else if(_axis == 'offset')
    state.offset += _value * 1.5
  else
      console.log('setOrbit: unexpected axis', _axis);
}

exports.setSpeed = (_axis, _value) => {
  if(_axis == 'x')
    state.speed.x += _value * .25
  else if(_axis == 'y')
    state.speed.y += _value * .25
  else
    console.log('setSpeed: unexpected axis', _axis);
}

exports.shade = (_shader) => {
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
let clock

//---------
let actor, logo
let sphere, cube, torus, ico, mult_sphere, mult_cube, mult_torus, mult_ico
let meshes = []
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
  actor = new THREE.Group()

  loadObject()
  initSphere()
  initCube()
  initTorus()
  initIso()

  // initMultSphere()
  // initMultCube()
  // initMultTorus()
  // initMultIso()

  space.add(actor)

  render()
}

let removeAllObjects = () => {
  for(var i = 0; i < actor.children.length; i++){
    actor.remove(actor.children[i])
  }
}

let initSphere = () => {
  let geom = new THREE.SphereGeometry(10, 10, 10)
  let mat = mat_noise
  sphere = new THREE.Mesh(geom, mat)
  sphere.position.x = origin.x
  sphere.position.y = origin.y
  sphere.position.z = origin.z
  sphere.visible = false;
  meshes.push(sphere)
  space.add(sphere)
}

let initCube = () => {
  let geom = new THREE.BoxGeometry(15, 15, 15)
  let mat = mat_stripes
  cube = new THREE.Mesh(geom, mat)
  cube.position.x = origin.x
  cube.position.y = origin.y
  cube.position.z = origin.z
  cube.scale.x = 3
  cube.visible = false;
  meshes.push(cube)
  space.add(cube)
}

let initTorus = () => {
  let geom = new THREE.TorusGeometry(5, 3, 20, 6)

  let mat = new THREE.MeshPhongMaterial();
  // mat.wireframe = true
  torus = new THREE.Mesh(geom, mat)
  torus.position.x = origin.x
  torus.position.y = origin.y
  torus.position.z = origin.z
  torus.visible = false;
  meshes.push(torus)
  space.add(torus)
}

let initIso = () => {
  let geom = new THREE.IcosahedronGeometry(6)
  let mat = mat_perlin
  // let mat = new THREE.MeshPhongMaterial();
  ico = new THREE.Mesh(geom, mat)
  ico.position.x = origin.x
  ico.position.y = origin.y
  ico.position.z = origin.z
  ico.visible = false;
  meshes.push(ico)
  space.add(ico)
}

let initMultSphere = () => {
  mult_sphere = new THREE.Group()
  for(var i = 0; i < 5; i++){
    let geom = new THREE.SphereGeometry(10, 10, 10)
    let mat = new THREE.MeshPhongMaterial({flatShading: true})
    let mesh = new THREE.Mesh(geom, mat)
    mult_sphere.add(mesh)
  }
}

let initMultCube = () => {
  mult_cube = new THREE.Group()
  for(var i = 0; i < 5; i++){
    let geom = new THREE.BoxGeometry(10, 10, 10)
    let mat = new THREE.MeshPhongMaterial({flatShading: true})
    let mesh = new THREE.Mesh(geom, mat)
    mult_cube.add(mesh)
  }
}

let initMultTorus = () => {
  mult_torus = new THREE.Group()
  for(var i = 0; i < 5; i++){
    let geom = new THREE.TorusGeometry(10, 10, 10)
    let mat = new THREE.MeshPhongMaterial({flatShading: true})
    let mesh = new THREE.Mesh(geom, mat)
    mult_torus.add(mesh)
  }
}

let initMultIso = () => {
  mult_ico = new THREE.Group()
  for(var i = 0; i < 5; i++){
    let geom = new THREE.IcosahedronGeometry(10, 10, 10)
    let mat = new THREE.MeshPhongMaterial({flatShading: true})
    let mesh = new THREE.Mesh(geom, mat)
    mult_ico.add(mesh)
  }
}

let mat_noise
let mat_perlin
let mat_stripes
let mat_basic

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
      uTanSquaresSize:{type: 'f', value: 0.4},
      uTanSquareModulo:{type: 'f', value: 20.},
      uNoiseDist:{type: 'f', value: 6.0},
      uNoiseSize:{type: 'f', value: 0.01},
      uNoiseSpeed:{type: 'f', value: 0.001},
      uNoiseImpact:{type: 'f', value: 1}
    },
    vertexShader: vsNoise,
    fragmentShader: fsNoise
  })

  sphere.material = mat_noise

  mat_stripes = new THREE.RawShaderMaterial( {
    uniforms: {
      uColor: { type: "c", value: new THREE.Color( 0xffff00 ) },
      uTime: { value: 1},
      uStep: { type: 'f', value: 0.1},
      uInvert: {value: true}
    },
    vertexShader: vsStripes,
    fragmentShader: fsStripes
  });

  cube.material = mat_stripes


  //----------------------BASIC
  mat_basic = new THREE.RawShaderMaterial( {
    uniforms: {
      uColor: { type: "c", value: new THREE.Color( 0xffff00 ) },
      uTime: { value: 1},
      uStep: { type: 'f', value: 0.1},
      uInvert: {value: true}
    },
    vertexShader: vsBasic,
    fragmentShader: fsBasic
  });

  torus.material = mat_basic

  //----------------------PERLIN
  mat_perlin = new THREE.RawShaderMaterial( {
    uniforms: {
      uTime: { type: 'f', value: 1.0}
    },
    vertexShader: vsPerlin,
    fragmentShader: fsPerlin
  });

  ico.material = mat_perlin
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

    for(var i = 0; i < object.children; i++){
      object.children[i].material = new THREE.MeshPhongMaterial({flatShading: true})
    }

    logo = object

    loadShaders()

    logo.position.x = origin.x
    logo.position.y = origin.y
    logo.position.z = origin.z
    logo.scale.x = 0.2
    logo.scale.y = 0.2
    logo.scale.z = 0.2
    logo.rotation.y = Math.PI/2
    logo.visible = false;
    meshes.push(logo)
    space.add(logo)

  })
}

let animate = () => {
  if(launched){
    //ORBIT
    actor.position.x = Math.sin(clock.getElapsedTime()*state.speed.x)*state.radius
    actor.position.z = Math.cos(clock.getElapsedTime()*state.speed.x)*state.radius

    //OFFSET
    actor.position.y = Math.sin(clock.getElapsedTime()*state.speed.y)*state.offset

    //ROTATION
    actor.rotation.x += state.rotation.x
    actor.rotation.y += state.rotation.y
    actor.rotation.z += state.rotation.z

    if(sphere.material != undefined)
      sphere.material.uniforms.uTime.value = clock.getElapsedTime();

    if(cube.material != undefined)
      cube.material.uniforms.uTime.value = clock.getElapsedTime();

    if(torus.material != undefined)
      torus.material.uniforms.uTime.value = clock.getElapsedTime();

    if(ico.material != undefined)
      ico.material.uniforms.uTime.value = clock.getElapsedTime();

    if(logo.visible)
      actor.lookAt(origin)
  }
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
