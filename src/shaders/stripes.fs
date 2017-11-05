precision highp float;

uniform vec3 uColor;
uniform float uTime;
uniform float uStep;
uniform bool uInvert;

varying vec3 vPos;

float remap(float old_value, float old_min, float old_max, float new_min, float new_max){
	float new_value = 0.;

	new_value = ((old_value - old_min) / (old_max - old_min)) * (new_max - new_min) + new_min;

	return new_value;
}

void main() {
	float a = 1.0;
	float sin_mod = 0.01;
	vec3 origin = vec3(0, 0, 0);
	vec3 col = vec3((vPos.x+1.0)*0.5);
	float bw = sin(uTime*0.001 * (mod(vPos.y, 1000.)-500.)) > 0. ? 1. : .2;
	col.r = col.g = col.b = bw;

	float dist = distance(origin, vPos);
	float n_dist = distance(origin, vPos);

	if(uInvert && mod(vPos.x, 30.) < 25.
		&& mod(vPos.y, 30.) > 5.
		&& sin(vPos.y*0.1) > 0.5
		&& tan(vPos.y*0.001 + vPos.y*0.1 - uTime) < 1.){
			col.r = col.g = col.b = 1.-col.r;
		}


	gl_FragColor = vec4( col, a);
}
