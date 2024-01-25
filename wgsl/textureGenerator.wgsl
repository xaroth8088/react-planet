const pi: f32 = radians(180.0);

fn sphereMap(u: f32, v: f32) -> vec3<f32> {
    let azimuth: f32 = 2.0 * pi * u;
    let inclination: f32 = pi * v;

    return vec3<f32>(
        sin(inclination) * cos(azimuth),
        sin(inclination) * sin(azimuth),
        cos(inclination)
    );
}

/*
    TODO: convert this to a WGSL compute shader.
        It should take in the NoiseSettings structs for surface, land, and cloud noises,
        as well as the various color settings/etc. as needed.
    TODO: Decide whether this should be a single compute shader that does all 4 textures
          at once, or if it should instead be 4 individual shaders, or if they're all together except for clouds, etc.

void TextureGenerator::GenerateTextures() {
    unsigned short int width = resolution;

    // The texture should have a 2:1 aspect ratio to wrap properly
    unsigned short int height = resolution / 2;

    RGB waterSpecularRGB = {
        static_cast<unsigned char>(waterSpecular * 255),
        static_cast<unsigned char>(waterSpecular * 255),
        static_cast<unsigned char>(waterSpecular * 255)
    };

    RGB landSpecularRGB = {
        0,
        0,
        0
    };

    RGB waterNormalPixel = {
        128,
        128,
        255
    };

    RGB waterColor;

    float *heightMap = new float[width * height];

    // Pre-calculate the noise, since we'll need to refer to nearby points later
    // when calculating normals
    for (unsigned int x = 0; x < width; x++) {
        for (unsigned int y = 0; y < height; y++) {
            Point p0 = sphereMap(float(x) / (width - 1.0),
                               float(y) / (height - 1.0));
            heightMap[y * width + x] = surfaceNoise->sample(p0);
        }
    }

    for (unsigned int x = 0; x < width; x++) {
        for (unsigned int y = 0; y < height; y++) {
            Point p0 = sphereMap(float(x) / (width - 1.0),
                               float(y) / (height - 1.0));
            float c0 = heightMap[y * width + x];

            if (c0 > waterLevel) {
                RGB c = surfaceColor(p0);
                setPixel(diffuseBuffer, x, y, c);

                setPixel(specularBuffer, x, y, landSpecularRGB);

                // Look at the points next to us to determine what our normal
                // should be
                unsigned int tempX = (x + 1) % (width - 1);
                unsigned int tempY = (y + 1) % (height - 1);

                float cx = heightMap[y * width + tempX];
                float cy = heightMap[tempY * width + x];

                Point n = normalizedCrossProduct(
                    1.0 / float(width),
                    0.0,
                    (cx - c0),
                    0.0,
                    1.0 / float(height),
                    (cy - c0)
                );
                n = wasm_f32x4_mul(
                    n,
                    wasm_f32x4_make(
                        1, -1, 1, 1
                    )
                );

                RGB normalPixel = normalRGB(n);
                setPixel(normalBuffer, x, y, normalPixel);
            } else {
                // For the "below water" case, there's no additional sampling -
                // we simply blend the shallow and deep water colors based on
                // how deep the water is at this point.
                float q1 = smootherstep(pow(c0 / waterLevel, waterFalloff));
                float q0 = 1.0 - q1;

                waterColor.r = waterDeep.r * q0 + waterShallow.r * q1;
                waterColor.g = waterDeep.g * q0 + waterShallow.g * q1;
                waterColor.b = waterDeep.b * q0 + waterShallow.b * q1;

                setPixel(diffuseBuffer, x, y, waterColor);

                setPixel(specularBuffer, x, y, waterSpecularRGB);

                setPixel(normalBuffer, x, y, waterNormalPixel);
            }

            setCloudPixel(
                cloudBuffer,
                x,
                y,
                cloudColor,
                cloudNoise->sample(p0) * cloudOpacity * 255  // Cloud opacity at this point
            );
        }
    }
}

*/
