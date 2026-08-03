export const paletteGLSL = `

vec3 palette(
    float t,
    float strength,
    float noise
)
{
    vec3 deepColor = vec3(
        0.03,
        0.08,
        0.18
    );

    vec3 midColor = vec3(
        0.12,
        0.40,
        0.95
    );

    vec3 hotColor = vec3(
        0.95,
        0.98,
        1.00
    );

    vec3 result = mix(
    deepColor,
    midColor,
    clamp(
        t + noise * 0.15,
        0.0,
        1.0
    )
);

float highlight = smoothstep(
    0.55,
    1.0,
    strength
);

result = mix(
    result,
    hotColor,
    highlight
);

return result;
}

`;
