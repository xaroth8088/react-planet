fn textureGeneratorWGSL(diffuseTexture: texture_storage_2d<rgba8unorm, write>, width: u32, index: u32) -> void {
    let x: u32 = index % width;
    let y: u32 = index / width;

    if( (index / 4) % 4 == 0) {
        textureStore( diffuseTexture, vec2<u32>(x, y), vec4<f32>( 1.0, 0.0, 1.0, 1.0 ));
    } else {
        textureStore( diffuseTexture, vec2<u32>(x, y), vec4<f32>( 0.0, 1.0, 0.0, 1.0 ));
    }
}
