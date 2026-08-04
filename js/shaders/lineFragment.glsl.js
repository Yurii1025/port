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

gl_FragColor =
    vec4(
        vec3(depth),
        vStrength * 0.18
    );
}
`;