struct Uniforms {
    normalScale: f32
};

// Bind group for uniforms
@group(0) @binding(0) var<uniform> uniforms : Uniforms;

// Texture outputs
@group(1) @binding(0) var normalsTexture : texture_storage_2d<rgba8unorm, write>;
@group(1) @binding(1) var diffuseTexture : texture_2d<f32>;

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    let pixelValue: vec4<f32> = textureLoad(diffuseTexture, global_id.xy, 0);

    textureStore(normalsTexture, global_id.xy, vec4<f32>(0.5, 0.5, pixelValue.w * uniforms.normalScale, 0.0));
}
