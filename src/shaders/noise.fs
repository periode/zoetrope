precision highp float;

#define HASHSCALE1 .1031

uniform float uTime;
varying vec3 vPosition;
vec3 col;
float alpha;


// noise https://github.com/ashima/webgl-noise/blob/master/src/noise3D.glsl
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
  {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
  }

float hash11(float p) {
	vec3 p3  = fract(vec3(p) * HASHSCALE1);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

uniform float uVerticalInterval;
uniform float uVerticalSpeed;

uniform float uIntervalCoeff;
uniform float uIntervalModulo;
uniform float uIntervalSpeed;

uniform float uBloomSpeed;
uniform float uBloomIntensity;

uniform float uTanSquaresSize;
uniform float uTanSquareModulo;

uniform float uNoiseDist;
uniform float uNoiseSize;
uniform float uNoiseSpeed;
uniform float uNoiseImpact;

void main() {
  alpha = 1.;
  vec3 origin = vec3(0.);
  float edge = 60.;
  if(distance(origin, vPosition) < edge){
    // col = vec3( (sin(hash11(vPosition.x + uTime*0.0001))+1.)*0.5);
    // col.r = col.g = col.b = pow(col.r, 10.);


    // RANDOM
    col = vec3(hash11((vPosition.y-100.-uTime*10.)*0.000005));


    // MODULO
    float innerModulo = mod(vPosition.x + uTime*uVerticalSpeed, uVerticalInterval);
    col.r -= innerModulo;
    col.g -= innerModulo;
    col.b -= innerModulo;


    float interval = mod(vPosition.x*uIntervalCoeff + vPosition.y*uIntervalCoeff * vPosition.z * uIntervalCoeff + uTime*uIntervalSpeed, uIntervalModulo);
    col.r *= interval;
    col.g *= interval;
    col.b *= interval;


    // BLOOM

    vec3 bloom = vec3(sin(uTime*uBloomSpeed)*edge, cos(uTime*uBloomSpeed*0.1)*edge, 0.);

    float circle = mix(distance(bloom, vPosition), 0., edge);
    col -= circle*mod(vPosition.x + vPosition.y + uTime*100., 100.)*uBloomIntensity;

    if(mod(tan(vPosition.y*uTanSquaresSize + uTime*.1), 100.) > uTanSquareModulo){
      col *= .01;
    }

    float waves = mix(distance(origin, vPosition), 0., snoise(vec3(vPosition.x*uNoiseSize, vPosition.y *uNoiseSize, uTime*uNoiseSpeed))*uNoiseDist);
    col *= waves*uNoiseImpact;


  }else{
    col = vec3(0.);
  }
  gl_FragColor = vec4(col, alpha);
}
