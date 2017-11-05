precision highp float;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 position;
varying vec3 vPosition;

void main(){
  vPosition = position;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
}
