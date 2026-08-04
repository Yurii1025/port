import { paletteGLSL } from "./common/palette.glsl.js";

export const lineFragmentShader = `

uniform vec3 color;

varying float vStrength;
varying float vDepth;

${paletteGLSL}

void main()
{
    vec3 finalColor = palette(
    vStrength,
    vStrength,
    0.0
);

    float depth =
    clamp(
        vDepth / 12.0,
        0.0,
        1.0
    );

float depthFade = smoothstep(
    2.0,
    10.0,
    vDepth
);

gl_FragColor = vec4(
    finalColor,
    vStrength * mix(
        0.18,
        0.05,
        depthFade
    )
);
}
`;