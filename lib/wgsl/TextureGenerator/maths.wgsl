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
) -> Color3 {
    let c: f32 = sampleAtPoint(p, landNoise, landNoisePermutations);

    // Blend landColor1 and landColor2
    let q0: f32 = c;
    let q1: f32 = 1.0 - c;

    return landColor1 * q0 + landColor2 * q1;
}

fn waterColor(
    c0: f32
) -> Color3 {
    // For the "below water" case, there's no additional sampling -
    // we simply blend the shallow and deep water colors based on
    // how deep the water is at this point.
    let q1: f32 = smootherstep(pow(c0 / uniforms.waterLevel, uniforms.waterFalloff));

    return mix(uniforms.waterShallowColor, uniforms.waterDeepColor, q1);
}

fn smootherstep(t: f32) -> f32 {
    return 6.0 * (pow(t, 5.0)) - 15.0 * (pow(t, 4.0)) + 10.0 * (pow(t, 3));
}
