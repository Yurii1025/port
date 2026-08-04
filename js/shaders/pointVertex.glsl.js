export const pointVertexShader = `

attribute float size;

varying float vDepth;

void main()
{
    vec4 mvPosition =
        modelViewMatrix *
        vec4(position, 1.0);

    vDepth = -mvPosition.z;

    float perspective = 80.0 / vDepth;

perspective = clamp(
    perspective,
    0.8,
    2.2
);

float baseSize = mix(
    1.5,
    3.5,
    (size - 0.75) / 0.5
);

gl_PointSize =
    baseSize * perspective;

    gl_Position =
        projectionMatrix *
        mvPosition;
}
`;