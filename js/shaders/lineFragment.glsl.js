import { paletteGLSL } from "./common/palette.glsl.js";

export const lineFragmentShader = `

uniform vec3 color;

varying float vStrength;

${paletteGLSL}

void main()
{
    vec3 finalColor = palette(
    vStrength,
    vStrength,
    0.0
);

    gl_FragColor = vec4(
        finalColor,
        vStrength * 0.18
    );
}
`;