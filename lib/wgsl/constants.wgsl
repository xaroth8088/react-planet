const pi: f32 = radians(180.0);

struct NoiseSettings {
    iScale: f32,
    iOctaves: u32,
    iFalloff: f32,
    iIntensity: f32,
    iRidginess: f32,
    sScale: f32,
    sOctaves: u32,
    sFalloff: f32,
    sIntensity: f32,
    padding0: u32,
    padding1: u32,
    padding2: u32
};

const landSpecularColor: vec4<f32> = vec4<f32>(0.0, 0.0, 0.0, 1.0);
const waterNormalPixel: vec4<f32> = vec4<f32>(0.5, 0.5, 1.0, 1.0);

alias Permutations = array<u32, 289>;
alias Color4 = vec4<f32>;
alias Color3 = vec3<f32>;
alias Point3 = vec3<f32>;
