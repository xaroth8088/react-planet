#define _USE_MATH_DEFINES
#include <cmath>

#include <stdlib.h>
#include <strings.h>
#include <string>

#include "TextureGenerator.h"

TextureGenerator::~TextureGenerator() {
    if (surfaceNoise != NULL) {
        delete surfaceNoise;
    }

    if (landNoise != NULL) {
        delete landNoise;
    }

    if (cloudNoise != NULL) {
        delete cloudNoise;
    }

    if (diffuseBuffer != NULL) {
        delete diffuseBuffer;
    }

    if (normalBuffer != NULL) {
        delete normalBuffer;
    }

    if (specularBuffer != NULL) {
        delete specularBuffer;
    }

    if (cloudBuffer != NULL) {
        delete cloudBuffer;
    }
}

RGB TextureGenerator::UL2RGB(unsigned long dwColor) {
    RGB tmp;

    // NOTE: Intentionally discarding alpha channel
    tmp.b = dwColor & 0xFF;
    dwColor >>= 8;
    tmp.g = dwColor & 0xFF;
    dwColor >>= 8;
    tmp.r = dwColor & 0xFF;

    return tmp;
}

XYZ sphereMap(float u, float v) {
    /*  Returns the 3D cartesian coordinate of a point on
        a sphere that corresponds to the given u,v coordinate. */
    float azimuth = 2.0 * M_PI * u;
    float inclination = M_PI * v;

    XYZ pos;

    pos.x = sin(inclination) * cos(azimuth);
    pos.y = sin(inclination) * sin(azimuth);
    pos.z = cos(inclination);

    return pos;
}

XYZ normalizedCrossProduct(float a1, float a2, float a3, float b1,
                           float b2, float b3) {
    XYZ retval;

    retval.x = (a2 * b3 - a3 * b2);
    retval.y = -(a1 * b3 - a3 * b1);
    retval.z = (a1 * b2 - a2 * b1);

    float len = sqrt((retval.x * retval.x) + (retval.y * retval.y) +
                      (retval.z * retval.z));
    retval.x /= len;
    retval.y /= len;
    retval.z /= len;

    return retval;
}

RGB normalRGB(float x, float y, float z) {
    RGB color;

    color.r = (x / 2.0 + 0.5) * 255;
    color.g = (y / 2.0 + 0.5) * 255;
    color.b = (z / 2.0 + 0.5) * 255;

    return color;
}

float smootherstep(float t) {
    return 6.0 * (pow(t, 5.0)) - 15.0 * (pow(t, 4.0)) + 10.0 * (pow(t, 3));
}

void TextureGenerator::init() {
    if (surfaceNoise != NULL) {
        // Re-init
        delete surfaceNoise;
        delete landNoise;
        delete cloudNoise;
        delete diffuseBuffer;
        delete normalBuffer;
        delete specularBuffer;
        delete cloudBuffer;
    }

    // Initialize the noise
    surfaceNoise = new NoiseWrapper(
        surfaceSeed, surfaceiScale, surfaceiOctaves, surfaceiFalloff,
        surfaceiIntensity, surfaceiRidginess, surfacesScale, surfacesOctaves,
        surfacesFalloff, surfacesIntensity);

    landNoise = new NoiseWrapper(
        landSeed, landiScale, landiOctaves, landiFalloff, landiIntensity,
        landiRidginess, landsScale, landsOctaves, landsFalloff, landsIntensity);

    cloudNoise =
        new NoiseWrapper(cloudSeed, cloudiScale, cloudiOctaves, cloudiFalloff,
                         cloudiIntensity, cloudiRidginess, cloudsScale,
                         cloudsOctaves, cloudsFalloff, cloudsIntensity);

    // Initialize the buffers
    diffuseBuffer = new unsigned char[getTextureSize(false)];
    normalBuffer = new unsigned char[getTextureSize(false)];
    specularBuffer = new unsigned char[getTextureSize(false)];
    cloudBuffer = new unsigned char[getTextureSize(true)];
}

unsigned long int TextureGenerator::getTextureSize(bool isClouds) {
    if (isClouds) {
        return resolution * resolution *
               2;  // Technically: resolutionX * (resolutionY / 2) * 4 bytes
    }

    return resolution * (resolution / 2) *
           3;  // Technically: resolutionX * (resolutionY / 2) * 3 bytes
}

RGB TextureGenerator::surfaceColor(float x, float y, float z) {
    float c = landNoise->sample(x, y, z);

    // Blend landColor1 and landColor2
    float q0 = c;
    float q1 = 1.0 - c;

    RGB retval;

    retval.r = landColor1.r * q0 + landColor2.r * q1;
    retval.g = landColor1.g * q0 + landColor2.g * q1;
    retval.b = landColor1.b * q0 + landColor2.b * q1;

    return retval;
}

void TextureGenerator::GenerateTextures() {
    unsigned short int width = resolution;
    unsigned short int height =
        resolution /
        2; /* The texture should have a 2:1 aspect ratio to wrap properly */

    RGB waterSpecularRGB;
    waterSpecularRGB.r = waterSpecular * 255;
    waterSpecularRGB.g = waterSpecular * 255;
    waterSpecularRGB.b = waterSpecular * 255;

    RGB landSpecularRGB;
    landSpecularRGB.r = 0;
    landSpecularRGB.g = 0;
    landSpecularRGB.b = 0;

    RGB waterNormalPixel;
    waterNormalPixel.r = 128;
    waterNormalPixel.g = 128;
    waterNormalPixel.b = 255;

    RGB waterColor;

    float *heightMap = new float[width * height];

    // Pre-calculate the noise, since we'll need to refer to nearby points later
    // when calculating normals
    for (unsigned int x = 0; x < width; x++) {
        for (unsigned int y = 0; y < height; y++) {
            XYZ p0 = sphereMap(float(x) / (width - 1.0),
                               float(y) / (height - 1.0));
            heightMap[y * width + x] = surfaceNoise->sample(p0.x, p0.y, p0.z);
        }
    }

    for (unsigned int x = 0; x < width; x++) {
        for (unsigned int y = 0; y < height; y++) {
            XYZ p0 = sphereMap(float(x) / (width - 1.0),
                               float(y) / (height - 1.0));
            float c0 = heightMap[y * width + x];

            if (c0 > waterLevel) {
                RGB c = surfaceColor(p0.x, p0.y, p0.z);
                setPixel(diffuseBuffer, x, y, c);

                setPixel(specularBuffer, x, y, landSpecularRGB);

                // Look at the points next to us to determine what our normal
                // should be
                unsigned int tempX = (x + 1) % (width - 1);
                unsigned int tempY = (y + 1) % (height - 1);

                float cx = heightMap[y * width + tempX];
                float cy = heightMap[tempY * width + x];

                XYZ n = normalizedCrossProduct(1.0 / float(width), 0.0,
                                               (cx - c0), 0.0,
                                               1.0 / float(height), (cy - c0));

                RGB normalPixel = normalRGB(n.x, -n.y, n.z);
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

            setCloudPixel(cloudBuffer, x, y, cloudColor,
                          cloudNoise->sample(p0.x, p0.y, p0.z) * cloudOpacity *
                              255  // Cloud opacity at this point
            );
        }
    }

    delete[] heightMap;
}

void TextureGenerator::setCloudPixel(unsigned char *buffer, unsigned int x,
                                     unsigned int y, RGB color,
                                     unsigned int opacity) {
    unsigned long int index = (y * resolution * 4) + x * 4;

    buffer[index + 0] = color.r;
    buffer[index + 1] = color.g;
    buffer[index + 2] = color.b;
    buffer[index + 3] = opacity;
}

void TextureGenerator::setPixel(unsigned char *buffer, unsigned int x,
                                unsigned int y, RGB color) {
    int index = (y * resolution * 3) + x * 3;

    buffer[index + 0] = color.r;
    buffer[index + 1] = color.g;
    buffer[index + 2] = color.b;
}
