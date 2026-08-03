export const remapGLSL = `

float remap(
    float value,
    float inMin,
    float inMax,
    float outMin,
    float outMax
)
{
    return
        outMin +
        (value - inMin) *
        (outMax - outMin) /
        (inMax - inMin);
}

`;