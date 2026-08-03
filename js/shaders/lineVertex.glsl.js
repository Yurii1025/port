export const lineVertexShader = `

attribute float strength;

varying float vStrength;

void main() {

    vStrength = strength;

    gl_Position =
        projectionMatrix *
        modelViewMatrix *
        vec4(position, 1.0);

}

`;