struct Uniforms {
    cloudNoise: NoiseSettings,
    textureWidth: u32,
    textureHeight: u32,
    cloudColor: Color4,
};

// Bind group for uniforms
@group(0) @binding(0) var<uniform> uniforms : Uniforms;

// Texture outputs
@group(1) @binding(0) var cloudsTexture : texture_storage_2d<rgba8unorm, write>;

// Noise permutations
@group(2) @binding(0) var<storage, read> cloudNoisePermutations : Permutations;

// Compute shader main entry point
@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    let x: u32 = global_id.x;
    let y: u32 = global_id.y;

    let width: f32 = f32(uniforms.textureWidth);
    let height: f32 = f32(uniforms.textureHeight);

    let p0: Point3 = sphereMap(
        f32(x) / (width - 1.0),
        f32(y) / (height - 1.0)
    );

    // Clouds
    let cloudFinalColor: Color4 = Color4(
        uniforms.cloudColor.xyz,
        uniforms.cloudColor.w * sampleAtPoint(p0, uniforms.cloudNoise, cloudNoisePermutations)
    );
    textureStore(cloudsTexture, vec2<u32>(x, y), cloudFinalColor);
}
