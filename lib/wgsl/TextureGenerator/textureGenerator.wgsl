struct Uniforms {
    surfaceNoise: NoiseSettings,
    landNoise: NoiseSettings,
    cloudNoise: NoiseSettings,
    renderType: u32,
    textureWidth: u32,
    textureHeight: u32,
    surfaceSeed: u32,
    landSeed: u32,
    cloudSeed: u32,
    waterLevel: f32,
    waterSpecular: f32,
    waterFalloff: f32,
    landColor1: Color3,
    landColor2: Color3,
    waterDeepColor: Color3,
    waterShallowColor: Color3,
    cloudColor: Color4,
};

// Bind group for uniforms
@group(0) @binding(0) var<uniform> uniforms : Uniforms;

// Texture outputs
@group(1) @binding(0) var diffuseTexture : texture_storage_2d<rgba8unorm, write>;
@group(1) @binding(1) var specularTexture : texture_storage_2d<rgba8unorm, write>;
@group(1) @binding(2) var cloudsTexture : texture_storage_2d<rgba8unorm, write>;

// Compute shader main entry point
@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    let width: f32 = f32(uniforms.textureWidth - 1);
    let height: f32 = f32(uniforms.textureHeight - 1);

    let p0: Point3 = sphereMap(
        f32(global_id.x) / width,
        f32(global_id.y) / height
    );

    if(uniforms.renderType == 0) {
        renderLand(global_id.xy, p0);
    } else if(uniforms.renderType == 1){
        renderClouds(global_id.xy, p0);
    }
}

fn renderLand(pos: vec2<u32>, p0: vec3<f32>) {
    // Land & sea
    let c0: f32 = sampleAtPoint(p0, uniforms.surfaceNoise, uniforms.surfaceSeed);

    var diffuseColor: Color3;
    var specularColor: Color3;
    var heightMapValue: f32;

    if (c0 > uniforms.waterLevel) {
        // Land
        let c: f32 = sampleAtPoint(p0, uniforms.landNoise, uniforms.landSeed);

        diffuseColor = mix(uniforms.landColor1, uniforms.landColor2, c);
        specularColor = landSpecularColor;
        heightMapValue = c0;
    } else {
        // Water
        // For the "below water" case, there's no additional sampling -
        // we simply blend the shallow and deep water colors based on
        // how deep the water is at this point.
        let q1: f32 = smoothstep(0.0, 1.0, pow(c0 / uniforms.waterLevel, uniforms.waterFalloff));

        diffuseColor = mix(uniforms.waterDeepColor, uniforms.waterShallowColor, q1);
        specularColor = Color3(uniforms.waterSpecular);
        heightMapValue = uniforms.waterLevel;
    }

    textureStore(specularTexture, pos, Color4(specularColor, 1.0));

    // NOTE: we're storing the height value into the alpha channel, so that we can use it to generate a normal map
    //       The renderer will just need to be told not to render this texture with alpha.
    textureStore(diffuseTexture, pos, Color4(diffuseColor, heightMapValue));
}

fn renderClouds(pos: vec2<u32>, p0: vec3<f32>) {
    let cloudFinalColor: Color4 = Color4(
        uniforms.cloudColor.xyz,
        uniforms.cloudColor.w * sampleAtPoint(p0, uniforms.cloudNoise, uniforms.cloudSeed)
    );
    textureStore(cloudsTexture, pos, cloudFinalColor);
}
