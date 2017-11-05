precision highp float;

#define HASHSCALE1 .1031

uniform vec3 uColor;
uniform float uTime;
uniform float uStep;
uniform bool uInvert;
uniform bool uClap;
uniform float uOffset;

varying vec3 vPos;

float hash11(float p)
	{
	vec3 p3  = fract(vec3(p) * HASHSCALE1);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
	}

void main() {
	float a = 1.0;
	float sin_mod = 0.01;
	vec3 origin = vec3(0, 0, 0);
	vec3 col = vec3((vPos.x+1.0)*0.5);
	float bw = sin(uTime*0.0001 * (mod(vPos.y, 1000.)-500.)) > 0. ? 1. : 0.;
	col.r = col.g = col.b = bw;

	float dist = distance(origin, vPos);
	float n_dist = distance(origin, vPos);
	if(dist < 600.){

		if(dist > 150.){


			float fade = smoothstep(150., 200., dist); //utime sin(uTime*0.07)+1.3)*250.

			col.r = col.g = col.b = fade*mod(vPos.y+uTime*0.05, ((sin(uTime*0.008)+1.3)*250.)) + sin(vPos.x*0.015) > 0.5 ? 0. : 1.;
			// if(fade*mod(vPos.y+uTime*0.05, ((sin(uTime*0.17)+1.3)*250.)) > 0.5){
			// 	col.r = col.g = col.b = fade*mod(vPos.y+uTime*0.05, ((sin(uTime*0.17)+1.3)*250.)) > 0.15 ? 0. : 1.;
			// }

			float bg_fade = smoothstep(150., 1000., dist);
			col.r -= sin(vPos.x + vPos.y+ 100.)*bg_fade*0.95;
			col.g -= sin(vPos.x + vPos.y+ 100.)*bg_fade*0.95;
			col.b -= sin(vPos.x + vPos.y+ 100.)*bg_fade*0.95;

			if(mod(vPos.x + vPos.y, 280.) < 250.){
				col += log(col);
			}

			if(uClap){
				float max_th = step(mod(vPos.x + vPos.y * 10. +uTime, 500.), 50. + uOffset * cos(abs(vPos.y + vPos.x) +uTime));
				float min_th = step(50. - uOffset * sin(abs(vPos.y + vPos.x) +uTime), mod(vPos.x + vPos.y * 10. +uTime, 500.)); //*
				float not_white = step(col.r, .9);

				float selected = step(hash11(vPos.x+vPos.y), 0.15);
				col = mix(col, col*4., max_th*min_th*not_white*selected);
			}
		}

	}else{

		col.r = col.g = col.b = 1.;
	}

	gl_FragColor = vec4( col, a);
}
