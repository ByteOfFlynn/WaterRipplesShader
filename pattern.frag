// make this 120 for the mac:
#version 330 compatibility

// lighting uniform variables -- these can be set once and left alone:
uniform float   uKa, uKd, uKs;	 // coefficients of each type of lighting -- make sum to 1.0
uniform vec4    uColor;		 // object color
uniform vec4    uSpecularColor;	 // light color
uniform float   uShininess;	 // specular exponent

// maps variables
uniform sampler2D uNormalMap;		// normal map
uniform sampler2D uDuDvMap;			// dudv map
uniform float     uDistortionScale;	// distortion
uniform float     uTime;			// time

// reflections
uniform samplerCube uCubeMap;       // cubemap 
uniform float uFresnelPower;        // fresnel reflection amount

// sun light
uniform vec3  uSunDirection;        // direction of sun
uniform vec3  uSunColor;            // sun light
uniform float uSunKs;				// intensity

// heightmaps
uniform sampler2D uHeightMapA;		// current map
uniform sampler2D uHeightMapB;		// next map

// in variables from the vertex shader and interpolated in the rasterizer:

in  vec3  vN;		   // normal vector
in  vec3  vL;		   // vector from point to light
in  vec3  vE;		   // vector from point to eye
in  vec2  vST;		   // (s,t) texture coordinates

out vec4 FragColor;

void
main( )
{
	// dudv setup
    vec2 dudvUV = vST + vec2(0.05 * uTime, 0.05 * uTime);
    vec3 dudvSample = texture(uDuDvMap, dudvUV).rgb;
    float offsetU = dudvSample.r * 2.0 - 1.0;
    float offsetV = dudvSample.g * 2.0 - 1.0;

    // distort normal
    vec2 normalUV = vST + vec2(offsetU, offsetV) * uDistortionScale;
    vec3 normalMapSample = texture(uNormalMap, normalUV).rgb;
	normalMapSample = normalMapSample * 2.0 - 1.0;
    vec3 Normal = normalize(normalMapSample);

	// apply the per-fragmewnt lighting to myColor:

	vec3 Light  = normalize(vL);
	vec3 Eye    = normalize(vE);

	vec3 ambient = uKa * uColor.rgb;

	float dd = max( dot(Normal,Light), 0. );       // only do diffuse if the light can see the point
	vec3 diffuse = uKd * dd * uColor.rgb;

	float ss = 0.;
	if( dd > 0. )	      // only do specular if the light can see the point
	{
		vec3 reflectDir = reflect( -Light, Normal );
		float rv = max(dot(Eye, normalize(reflectDir)), 0.0);
		ss = pow( rv, uShininess );
	}
	vec3 specular = uKs * ss * uSpecularColor.rgb;
	vec3 lightingColor = ambient + diffuse + specular;

	// sun lighting
	vec3 sunDir = normalize(uSunDirection);
    float sunDiffuseFactor = max(dot(Normal, sunDir), 0.0);
    vec3 sunDiffuse = sunDiffuseFactor * uSunColor * uKd;

    // specular
    float sunSpec = 0.0;
    if(sunDiffuseFactor > 0.0)
    {
        vec3 sunReflect = reflect(-sunDir, Normal);
        float rv = max(dot(Eye, sunReflect), 0.0);
        sunSpec = pow(rv, uShininess);
    }
    vec3 sunSpecular = sunSpec * uSunColor * uSunKs;
    lightingColor += sunDiffuse + sunSpecular;

	// reflections and fresnel
	vec3 reflectionDir = reflect(-Eye, Normal);
    vec3 envColor = texture(uCubeMap, reflectionDir).rgb;
    float viewDot = max(dot(Normal, Eye), 0.0);
    float fresnel = pow(1.0 - viewDot, 3);
    vec3 finalColor = mix(lightingColor, envColor, fresnel);

	FragColor = vec4(finalColor, 1.0);
}

