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
            0.35,
            d
        );

    gl_FragColor =
        vec4(
            vec3(1.0),
            alpha * 0.9
        );
}
`;