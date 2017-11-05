precision mediump float;
uniform float uTime;
uniform vec3  uCursor;
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
   float z = computeZ(vPosition.xy, 1.0);

   // BACKGROUND SHADE IS JUST BLACK (ZERO).
   float s = 0.5;
   if(mod(x, 2.0) < 1.0 && mod(y, 2.0) < 1.0){
    s = 1.0;
   }else{
      s = 0.0;
   }

   //s = mod(x, 2.0) * 0.1 + mod(y, 2.0) * 0.15 + cos(mod(uTime, 10.0)) + sin(mod(uTime, 9.0));
   s = z;


   // IF WE ARE IN THE SPHERE, THEN SHADE IT.

   if (z > 0.) {

      // START WITH DARK SHADE.

      s = 0.5;

      // ADD CRAZY ANIMATED "WOODGRAIN" TEXTURE.

      s *= 0.8 + (0.2 * tan(uTime)) - sin(x*uTime) - sin(y*uTime);
   }else{
      s *= 0.8 + (0.2 * tan(uTime)) - cos(y*uTime) - sin(x*uTime);
   }

   // MULTIPY SHADE BY "WOOD" COLOR.

   gl_FragColor = vec4(s * vec3(0.9, 0.9, 0.9), 1.);
}
