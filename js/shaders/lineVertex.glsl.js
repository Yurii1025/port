export const lineVertexShader = `

attribute float strength;

varying float vStrength;

varying float vDepth;

void main() {

    vStrength = strength;

    vec4 mvPosition =
    modelViewMatrix *
    vec4(position, 1.0);

vDepth = -mvPosition.z;

gl_Position =
    projectionMatrix *
    mvPosition;

}

`;