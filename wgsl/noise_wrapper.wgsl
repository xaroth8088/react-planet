struct NoiseSettings {
    seed: f32,
    iScale: f32,
    iOctaves: u32,
    iFalloff: f32,
    iIntensity: f32,
    iRidginess: f32,
    sScale: f32,
    sOctaves: u32,
    sFalloff: f32,
    sIntensity: f32,
};

fn getOctave(p0: vec3<f32>, octaves: u32, seed: f32) -> f32 {
    var val: f32 = 0.0;
    var scale: f32 = 1.0;

    for (var i: u32 = 0; i < octaves; i = i + 1) {
        val = val + (0.5 + simplex3d((p0.p.xyz * scale), seed)) / scale;
        scale = scale * 2.0;
    }

    return val;
}

fn getNormalizedOctave(p0: vec3<f32>, octaves: u32, seed: f32) -> f32 {
    let q: f32 = 2.0 - (1.0 / pow(2.0, f32(octaves - 1)));
    return getOctave(p0, octaves, seed) / q;
}

fn ridgify(value: f32) -> f32 {
    return 1.0 - (2.0 * abs(value - 0.5));
}

fn sampleAtPoint(p0: vec3<f32>, settings: NoiseSettings) -> f32 {
    var offset: f32 = 0.0;

    if (settings.sOctaves > 0u) {
        var p: vec3<f32> = p0.p / settings.sScale;
        offset = getOctave(p, settings.sOctaves, settings.seed);

        offset = pow(offset, settings.sFalloff);
        offset = offset * settings.sIntensity;
    }

    var i: vec3<f32> = (p0.p / settings.iScale) + vec3<f32>(offset, offset, offset);
    var value: f32 = getNormalizedOctave(i, settings.iOctaves, settings.seed);

    if (settings.iRidginess > 0.0) {
        var r: vec3<f32> = (p0.p / settings.iScale) + vec3<f32>(offset, offset, offset + 11.0);
        var ridge: f32 = getNormalizedOctave(r, settings.iOctaves, settings.seed);

        value = settings.iRidginess * ridgify(ridge) + (1.0 - settings.iRidginess) * value;
    }

    value = pow(value, settings.iFalloff);
    value = max(0.0, min(1.0, value * settings.iIntensity));

    return value;
}