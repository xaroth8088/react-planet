fn sphereMap(u: f32, v: f32) -> vec3<f32> {
    let azimuth: f32 = 2.0 * pi * u;
    let inclination: f32 = pi * v;

    return vec3<f32>(
        sin(inclination) * cos(azimuth),
        sin(inclination) * sin(azimuth),
        cos(inclination)
    );
}

fn surfaceColor(
    p: vec3<f32>,
    landNoise: NoiseSettings,
    landNoisePermutations: array<u32, 289>,
    landColor1: vec3<f32>,
    landColor2: vec3<f32>
) -> vec4<f32> {
    let c: f32 = sampleAtPoint(p, landNoise, landNoisePermutations);

    // Blend landColor1 and landColor2
    let q0: f32 = c;
    let q1: f32 = 1.0 - c;

    return vec4<f32>(
        landColor1 * q0 + landColor2 * q1,
        1.0
    );
}

fn smootherstep(t: f32) -> f32 {
    return 6.0 * (pow(t, 5.0)) - 15.0 * (pow(t, 4.0)) + 10.0 * (pow(t, 3));
}
