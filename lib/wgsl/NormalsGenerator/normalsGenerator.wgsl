struct Uniforms {
    normalScale: f32
}

// Bind group for uniforms
@group(0) @binding(0) var<uniform> uniforms : Uniforms;

// Texture outputs
@group(1) @binding(0) var diffuseTexture : texture_2d<f32>;
@group(1) @binding(1) var normalsTexture : texture_storage_2d<rgba8unorm, write>;

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    let x: u32 = global_id.x;
    let y: u32 = global_id.y;

    textureStore(normalsTexture, vec2<u32>(x, y), vec4<f32>(0.5, 0.5, uniforms.normalScale, 0.0));
}
