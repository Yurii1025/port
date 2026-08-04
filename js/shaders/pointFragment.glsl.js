export const pointFragmentShader = `

varying float vDepth;

void main()
{
    vec2 uv =
        gl_PointCoord - 0.5;

    float d = length(uv);

    if (d > 0.5)
    {
        discard;
    }

    float alpha =
        smoothstep(
            0.5,
            0.15,
            d
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
    vec3(1.0),
    alpha * mix(
        1.0,
        0.45,
        depthFade
    )
);
}
`;