import { hashGLSL } from "./common/hash.glsl.js";
import { noiseGLSL } from "./common/noise.glsl.js";
import { fbmGLSL } from "./common/fbm.glsl.js";
import { remapGLSL } from "./common/remap.glsl.js";

export const triangleVertexShader = `

attribute float strength;

uniform float time;

varying float vStrength;
varying vec3 vWorldPosition;

${hashGLSL}

${noiseGLSL}

${fbmGLSL}

${remapGLSL}

void main()
{
    vec3 pos = position;

    float wave = fbm(
        pos.xy * 2.0 +
        vec2(
            time * 0.15,
            time * 0.10
        )
    );

    float displacement = remap(
    wave,
    0.0,
    1.0,
    -0.015,
     0.015
    );

    pos += normalize(position) * displacement;

    vStrength = strength * mix(
        0.45,
        1.0,
        wave
    );

    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);

    vWorldPosition = worldPosition.xyz;

    gl_Position =
        projectionMatrix *
        viewMatrix *
        worldPosition;
}
`;