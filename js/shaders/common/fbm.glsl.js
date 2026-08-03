export const fbmGLSL = `

float fbm(vec2 p)
{
    float value = 0.0;
    float amplitude = 0.5;

    mat2 rotation = mat2(
         0.80, -0.60,
         0.60,  0.80
    );

    for (int i = 0; i < 5; i++)
    {
        value += amplitude * noise(p);

        p = rotation * p * 2.02;

        amplitude *= 0.5;
    }

    return value;
}

`;