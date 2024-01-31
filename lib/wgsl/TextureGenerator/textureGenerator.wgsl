struct Uniforms {
    surfaceNoise: NoiseSettings,
    landNoise: NoiseSettings,
    cloudNoise: NoiseSettings,
    textureWidth: u32,
    textureHeight: u32,
    landColor1: Color3,
    landColor2: Color3,
    waterDeepColor: Color3,
    waterShallowColor: Color3,
    cloudColor: Color4,
    waterLevel: f32,
    waterSpecular: f32,
    waterFalloff: f32,
};

// Bind group for uniforms
@group(0) @binding(0) var<uniform> uniforms : Uniforms;

// Texture outputs
@group(1) @binding(0) var diffuseTexture : texture_storage_2d<rgba8unorm, write>;
@group(1) @binding(1) var specularTexture : texture_storage_2d<rgba8unorm, write>;
@group(1) @binding(2) var cloudsTexture : texture_storage_2d<rgba8unorm, write>;

// Noise permutations
@group(2) @binding(0) var<storage, read> surfaceNoisePermutations : Permutations;
@group(2) @binding(1) var<storage, read> landNoisePermutations : Permutations;
@group(2) @binding(2) var<storage, read> cloudNoisePermutations : Permutations;

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

    // Land & sea
    let c0: f32 = sampleAtPoint(p0, uniforms.surfaceNoise, surfaceNoisePermutations);

    var diffuseColor: Color3;
    var specularColor: Color3;
    var heightMapValue: f32 = c0;

    if (c0 > uniforms.waterLevel) {
        // Land
        diffuseColor = surfaceColor(p0, uniforms.landNoise, landNoisePermutations, uniforms.landColor1, uniforms.landColor2);
        specularColor = landSpecularColor;
    } else {
        // Water
        diffuseColor = waterColor(c0);
        specularColor = Color3(uniforms.waterSpecular);
        heightMapValue = uniforms.waterLevel;
    }

    textureStore(specularTexture, vec2<u32>(x, y), Color4(specularColor, 1.0));

    // NOTE: we're storing the height value into the alpha channel, so that we can use it to generate a normal map
    //       The renderer will just need to be told not to render this texture with alpha.
    textureStore(diffuseTexture, vec2<u32>(x, y), Color4(diffuseColor, heightMapValue));
}
