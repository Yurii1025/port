import { hashGLSL } from "./common/hash.glsl.js";
import { noiseGLSL } from "./common/noise.glsl.js";
import { fbmGLSL } from "./common/fbm.glsl.js";
import { paletteGLSL } from "./common/palette.glsl.js";
import { remapGLSL } from "./common/remap.glsl.js";
import { constantsGLSL } from "./common/constants.glsl.js";

export const triangleFragmentShader = `

uniform vec3 color;
uniform float time;

varying float vStrength;
varying vec3 vWorldPosition;
varying float vDepth;

${hashGLSL}

${noiseGLSL}

${fbmGLSL}

${paletteGLSL}

${remapGLSL}

${constantsGLSL}


void main()
{
    float n = fbm(
    vWorldPosition.xy * 3.0
);

    float wave =
    0.5 +
    0.5 *
    sin(
        time * 0.15 +
        vWorldPosition.x * 1.5 +
        vWorldPosition.y * 1.2
    );

    float gradient = mix(
    wave,
    n,
    0.35
);

    vec3 finalColor = palette(
    gradient,
    vStrength,
    n
);

float glowNoise = remap(
    n,
    0.0,
    1.0,
    0.15,
    0.95
);

float glow = remap(
    glowNoise,
    0.0,
    1.0,
    0.95,
    1.10
);

glow *= remap(
    vStrength,
    0.0,
    1.0,
    0.85,
    1.25
);

finalColor *= glow;

    finalColor *= remap(
    n,
    0.0,
    1.0,
    0.92,
    1.00
);

    float alpha = remap(
    vStrength,
    0.0,
    1.0,
    0.10,
    0.45
);



    gl_FragColor =
        vec4(finalColor, alpha);
}
`;