fn textureGeneratorWGSL(diffuseTexture: texture_storage_2d<rgba8unorm, write>, width: u32, index: u32) -> void {
    let x: u32 = index % width;
    let y: u32 = index / width;

    textureStore( diffuseTexture, vec2<u32>(x, y), vec4<f32>( 1.0, 0.0, 1.0, 1.0 ));
}
