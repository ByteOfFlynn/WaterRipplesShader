// make this 120 for the mac:
#version 330 compatibility

// heightmap variables

uniform sampler2D uHeightMapA;   		// current heightmap
uniform sampler2D uHeightMapB;   		// next heightmap
uniform float     uBlend;        		// blend
uniform float     uDisplacementScale;	// scale

uniform float     uTime;		// time

// wave 1 variables
uniform float     uAmp1;    	// amp
uniform float     uFreq1;   	// freq
uniform float     uSpeed1;  	// speed
uniform float     uDirX1;   	// direction of x
uniform float     uDirZ1;   	// direction of z
uniform float     uPhase1;  	// phase

// same but for wave 2
uniform float     uAmp2;    
uniform float     uFreq2;   
uniform float     uSpeed2;  
uniform float     uDirX2;   
uniform float     uDirZ2;   
uniform float     uPhase2; 

// out variables to be interpolated in the rasterizer and sent to each fragment shader:

out  vec2  vST;	  // (s,t) texture coordinates
out  vec3  vN;	  // normal vector
out  vec3  vL;	  // vector from point to light
out  vec3  vE;	  // vector from point to eye

// where the light is:

const vec3 LightPosition = vec3(  0., 5., 5. );

void
main( )
{
	vST = gl_MultiTexCoord0.st;
	vec3 pos = gl_Vertex.xyz;
	
	// wave displacement 
	float waveVal1 = sin((uDirX1*pos.x + uDirZ1*pos.z)*uFreq1 - uTime*uSpeed1 + uPhase1)*uAmp1;
    float waveVal2 = sin((uDirX2*pos.x + uDirZ2*pos.z)*uFreq2 - uTime*uSpeed2 + uPhase2)*uAmp2;
    pos.y += (waveVal1 + waveVal2);

	// blend heightmap
	float hA = texture(uHeightMapA, vST).r;
    float hB = texture(uHeightMapB, vST).r;
    float finalHeight = mix(hA, hB, uBlend);
    pos.y += finalHeight * uDisplacementScale;
	
	vec4 ECposition = gl_ModelViewMatrix * vec4(pos, 1.0);
	vN = normalize( gl_NormalMatrix * gl_Normal );  // normal vector
	vL = LightPosition - ECposition.xyz;	    // vector from the point
							// to the light position
	vE = -ECposition.xyz;       // vector from the point
							// to the eye position
	gl_Position = gl_ModelViewProjectionMatrix * vec4(pos, 1.0);
}
