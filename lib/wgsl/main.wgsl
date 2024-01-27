fn entry(
    diffuseTexture: texture_storage_2d<rgba8unorm, write>,
    normalTexture: texture_storage_2d<rgba8unorm, write>,
    specularTexture: texture_storage_2d<rgba8unorm, write>,
    cloudTexture: texture_storage_2d<rgba8unorm, write>,
    textureSize: vec2<f32>,
    landColor1: vec3<f32>,
    landColor2: vec3<f32>,
    waterDeepColor: vec3<f32>,
    waterShallowColor: vec3<f32>,
    cloudColor: vec4<f32>,
    waterLevel: f32,
    waterSpecular: f32,
    waterFalloff: f32,
    surfaceNoise_seed: f32,
    surfaceNoise_iScale: f32,
    surfaceNoise_iOctaves: u32,
    surfaceNoise_iFalloff: f32,
    surfaceNoise_iIntensity: f32,
    surfaceNoise_iRidginess: f32,
    surfaceNoise_sScale: f32,
    surfaceNoise_sOctaves: u32,
    surfaceNoise_sFalloff: f32,
    surfaceNoise_sIntensity: f32,
    landNoise_seed: f32,
    landNoise_iScale: f32,
    landNoise_iOctaves: u32,
    landNoise_iFalloff: f32,
    landNoise_iIntensity: f32,
    landNoise_iRidginess: f32,
    landNoise_sScale: f32,
    landNoise_sOctaves: u32,
    landNoise_sFalloff: f32,
    landNoise_sIntensity: f32,
    cloudNoise_seed: f32,
    cloudNoise_iScale: f32,
    cloudNoise_iOctaves: u32,
    cloudNoise_iFalloff: f32,
    cloudNoise_iIntensity: f32,
    cloudNoise_iRidginess: f32,
    cloudNoise_sScale: f32,
    cloudNoise_sOctaves: u32,
    cloudNoise_sFalloff: f32,
    cloudNoise_sIntensity: f32,
    index: u32
) -> void {
    let uTextureSize : vec2<u32> = vec2<u32>(textureSize);

    let x: u32 = index % uTextureSize.x;
    let y: u32 = index / uTextureSize.x;

    let surfaceNoise: NoiseSettings = NoiseSettings(
        surfaceNoise_seed,
        surfaceNoise_iScale,
        surfaceNoise_iOctaves,
        surfaceNoise_iFalloff,
        surfaceNoise_iIntensity,
        surfaceNoise_iRidginess,
        surfaceNoise_sScale,
        surfaceNoise_sOctaves,
        surfaceNoise_sFalloff,
        surfaceNoise_sIntensity
    );

    let landNoise: NoiseSettings = NoiseSettings(
        landNoise_seed,
        landNoise_iScale,
        landNoise_iOctaves,
        landNoise_iFalloff,
        landNoise_iIntensity,
        landNoise_iRidginess,
        landNoise_sScale,
        landNoise_sOctaves,
        landNoise_sFalloff,
        landNoise_sIntensity
    );

    let cloudNoise: NoiseSettings = NoiseSettings(
        cloudNoise_seed,
        cloudNoise_iScale,
        cloudNoise_iOctaves,
        cloudNoise_iFalloff,
        cloudNoise_iIntensity,
        cloudNoise_iRidginess,
        cloudNoise_sScale,
        cloudNoise_sOctaves,
        cloudNoise_sFalloff,
        cloudNoise_sIntensity
    );

    textureGenerator(
        x, y,
        diffuseTexture,
        normalTexture,
        specularTexture,
        cloudTexture,
        uTextureSize,
        landColor1,
        landColor2,
        waterDeepColor,
        waterShallowColor,
        cloudColor,
        waterLevel,
        waterSpecular,
        waterFalloff,
        surfaceNoise,
        landNoise,
        cloudNoise
    );
}
