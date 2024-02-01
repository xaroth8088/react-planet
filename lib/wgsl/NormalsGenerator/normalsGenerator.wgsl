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
    textureStore(
        normalsTexture,
        global_id.xy,
        vec4<f32>(calcNormalHeight(global_id.xy), 0.0)
    );
}

fn calcNormalFrom4Samples(r: vec3<f32>, l: vec3<f32>, a: vec3<f32>, b: vec3<f32>, h: f32) -> vec3<f32> {
    // Get a modifiable copy of each of the vectors
    var r_mod: vec3<f32> = r;
    var l_mod: vec3<f32> = l;
    var a_mod: vec3<f32> = a;
    var b_mod: vec3<f32> = b;

    // Get the height deltas for each direction
    // This is equivalent to taking the whole shebang and moving it so that h sits at 0.
    r_mod.z = (r_mod.z - h) * 64.0;
    l_mod.z = (l_mod.z - h) * 64.0;
    a_mod.z = (a_mod.z - h) * 64.0;
    b_mod.z = (b_mod.z - h) * 64.0;

    // Normalize the vectors for the 4 directions
    r_mod = normalize(r_mod);
    l_mod = normalize(l_mod);
    a_mod = normalize(a_mod);
    b_mod = normalize(b_mod);

    // Find the average normal within this set
    return normalize(
        cross(r_mod, a_mod) -
        cross(l_mod, a_mod) -
        cross(r_mod, b_mod) +
        cross(l_mod, b_mod)
    ) * vec3<f32>(1.0, -1.0, 1.0); // invert Y-Axis because of chirality of coord system
}

fn calcNormalHeight(texCoord: vec2<u32>) -> vec3<f32> {
    let textureDims : vec2<u32> = textureDimensions(diffuseTexture, 0);

    let v2r: vec2<i32> = vec2<i32>( 1, 0);
    let v2l: vec2<i32> = vec2<i32>( -1, 0);
    let v2a: vec2<i32> = vec2<i32>( 0, 1);
    let v2b: vec2<i32> = vec2<i32>( 0, -1);

    let h: f32 = getHeight(texCoord);
    let r: f32 = getHeight(getAdjacentCoord(texCoord, v2r, textureDims));
    let l: f32 = getHeight(getAdjacentCoord(texCoord, v2l, textureDims));
    let a: f32 = getHeight(getAdjacentCoord(texCoord, v2a, textureDims));
    let b: f32 = getHeight(getAdjacentCoord(texCoord, v2b, textureDims));

    let rawNormal: vec3<f32> = calcNormalFrom4Samples(
        vec3<f32>(vec2<f32>(v2r), r),
        vec3<f32>(vec2<f32>(v2l), l),
        vec3<f32>(vec2<f32>(v2a), a),
        vec3<f32>(vec2<f32>(v2b), b),
        h
    ) * uniforms.normalScale;

    // Our normal map requires that "neutral" sit at 0.5, 0.5, 0.5, where z can't be at or below 0.5
    let adjNormal: vec3<f32> = vec3<f32>(
        (rawNormal.x + 1.0) / 2.0,
        (rawNormal.y + 1.0) / 2.0,
        rawNormal.z + 1.00000001
    );

    return adjNormal;
}

fn getHeight(pos: vec2<u32>) -> f32 {
    let pixelValue: vec4<f32> = textureLoad(diffuseTexture, pos.xy, 0);
    return pixelValue.w;
}

fn getAdjacentCoord(pos: vec2<u32>, delta: vec2<i32>, dims: vec2<u32>) -> vec2<u32> {
    let iPos: vec2<i32> = vec2<i32>(pos);
    let adjustedPos: vec2<i32> = iPos + delta + vec2<i32>(dims);

    return vec2<u32>(
        u32(adjustedPos.x) % dims.x,
        u32(adjustedPos.y) % dims.y
    );
}
