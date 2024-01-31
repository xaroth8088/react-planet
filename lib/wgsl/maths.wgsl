fn sphereMap(u: f32, v: f32) -> Point3 {
    let azimuth: f32 = 2.0 * pi * u;
    let inclination: f32 = pi * v;

    return Point3(
        sin(inclination) * cos(azimuth),
        sin(inclination) * sin(azimuth),
        cos(inclination)
    );
}

fn surfaceColor(
    p: Point3,
    landNoise: NoiseSettings,
    landNoisePermutations: Permutations,
    landColor1: Color3,
    landColor2: Color3
) -> Color4 {
    let c: f32 = sampleAtPoint(p, landNoise, landNoisePermutations);

    // Blend landColor1 and landColor2
    let q0: f32 = c;
    let q1: f32 = 1.0 - c;

    return Color4(
        landColor1 * q0 + landColor2 * q1,
        1.0
    );
}

fn smootherstep(t: f32) -> f32 {
    return 6.0 * (pow(t, 5.0)) - 15.0 * (pow(t, 4.0)) + 10.0 * (pow(t, 3));
}
