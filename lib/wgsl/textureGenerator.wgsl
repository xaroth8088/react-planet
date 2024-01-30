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

// Define uniform buffer for input parameters
struct Uniforms {
    textureWidth: u32,
    textureHeight: u32,
    landColor1: vec3<f32>,
    landColor2: vec3<f32>,
    waterDeepColor: vec3<f32>,
    waterShallowColor: vec3<f32>,
    cloudColor: vec4<f32>,
    waterLevel: f32,
    waterSpecular: f32,
    waterFalloff: f32,
    normalScale: f32,
    surfaceNoise: NoiseSettings,
    landNoise: NoiseSettings,
    cloudNoise: NoiseSettings,
};

// Bind group for uniforms
@group(0) @binding(0) var<uniform> uniforms : Uniforms;

// Texture outputs
@group(1) @binding(0) var diffuseTexture : texture_storage_2d<rgba8unorm, write>;
@group(1) @binding(1) var normalTexture : texture_storage_2d<rgba8unorm, write>;
@group(1) @binding(2) var specularTexture : texture_storage_2d<rgba8unorm, write>;
@group(1) @binding(3) var cloudsTexture : texture_storage_2d<rgba8unorm, write>;

// Noise permutations
@group(2) @binding(0) var<storage, read> surfaceNoisePermutations : array<u32, 289>;
@group(2) @binding(1) var<storage, read> landNoisePermutations : array<u32, 289>;
@group(2) @binding(2) var<storage, read> cloudNoisePermutations : array<u32, 289>;

// Compute shader main entry point
@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    let x: u32 = global_id.x;
    let y: u32 = global_id.y;

    let width: f32 = f32(uniforms.textureWidth);
    let height: f32 = f32(uniforms.textureHeight);

    let p0: vec3<f32> = sphereMap(
        f32(x) / (width - 1.0),
        f32(y) / (height - 1.0)
    );

    let waterSpecularRGBA: vec4<f32> = vec4<f32>(
        vec3<f32>(uniforms.waterSpecular),
        1.0
    );

    // Clouds
    let cloudFinalColor: vec4<f32> = vec4<f32>(
        uniforms.cloudColor.xyz,
        uniforms.cloudColor.w * sampleAtPoint(p0, uniforms.cloudNoise, cloudNoisePermutations)
    );
    textureStore(cloudsTexture, vec2<u32>(x, y), cloudFinalColor);

    // Land & sea
    let c0: f32 = sampleAtPoint(p0, uniforms.surfaceNoise, surfaceNoisePermutations);

    if (c0 > uniforms.waterLevel) {
        textureStore(diffuseTexture, vec2<u32>(x, y), surfaceColor(p0, uniforms.landNoise, landNoisePermutations, uniforms.landColor1, uniforms.landColor2));
        textureStore(specularTexture, vec2<u32>(x, y), landSpecularColor);

        // Get our neighbors to determine our normal
        let cx: f32 = sampleAtPoint(
            sphereMap(
                f32(x + 1) / (width - 1.0),
                f32(y) / (height - 1.0)
            ),
            uniforms.surfaceNoise,
            surfaceNoisePermutations
        );
        let cy: f32 = sampleAtPoint(
            sphereMap(
                f32(x) / (width - 1.0),
                f32(y + 1) / (height - 1.0)
            ),
            uniforms.surfaceNoise,
            surfaceNoisePermutations
        );

        let n: vec3<f32> = normalize(cross(
            vec3<f32>(
                (1.0 / width),
                0.0,
                cx - c0
            ),
            vec3<f32>(
                0.0,
                1.0 / height,
                cy - c0
            )
        ));
        let n1: vec3<f32> = n * vec3<f32>(1.0, -1.0, 1.0);
        let converted: vec3<f32> = (n1 / 2.0 + 0.5) * uniforms.normalScale;
        textureStore(normalTexture, vec2<u32>(x, y), vec4<f32>(converted, 1.0));
    } else {
        // For the "below water" case, there's no additional sampling -
        // we simply blend the shallow and deep water colors based on
        // how deep the water is at this point.
        let q1: f32 = smootherstep(pow(c0 / uniforms.waterLevel, uniforms.waterFalloff));
        let q0: f32 = 1.0 - q1;

        let waterColor: vec3<f32> = uniforms.waterDeepColor * q0 + uniforms.waterShallowColor * q1;

        textureStore(
            diffuseTexture,
            vec2<u32>(x, y),
            vec4<f32>(waterColor, 1.0)
        );
        textureStore(specularTexture, vec2<u32>(x, y), waterSpecularRGBA);

        textureStore(normalTexture, vec2<u32>(x, y), waterNormalPixel);
    }
}
