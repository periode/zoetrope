precision mediump float;
uniform float uTime;
varying vec3  vPosition;

// COMPUTE THE Z FOR A SPHERE OF RADIUS r.

float computeZ(vec2 xy, float r) {
   //float zz = 1.0 - sqrt(xy.x*xy.y + xy.x*xy.y) ;
   float zz = xy.x / xy.y;
      return zz;
}

void main() {
   float x = vPosition.x;
   float y = vPosition.y;
   float s = 0.;

   s = (mod(x, 2.0) * 0.1 + mod(y, 2.0+abs(vPosition.y)) * 0.15 + cos(mod(uTime, 10.0+abs(vPosition.z))) + sin(mod(uTime, 9.0))) > 0. ? 1. : 0.;

   gl_FragColor = vec4(vec3(1.)*s, 1.);
}
