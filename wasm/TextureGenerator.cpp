#define _USE_MATH_DEFINES
#include <cmath>

#include <string>
#include <strings.h>
#include <stdlib.h>

#include "TextureGenerator.h"


RGB TextureGenerator::UL2RGB(unsigned long dwColor)
{
    RGB tmp;

    // NOTE: Intentionally discarding alpha channel
    tmp.b = dwColor & 0xFF;
    dwColor >>= 8;
    tmp.g = dwColor & 0xFF;
    dwColor >>= 8;
    tmp.r = dwColor & 0xFF;

    return tmp;
}

XYZ sphereMap(double u, double v)
{
    /*  Returns the 3D cartesian coordinate of a point on
        a sphere that corresponds to the given u,v coordinate. */
    double azimuth = 2.0 * M_PI * u;
    double inclination = M_PI * v;

    XYZ pos;

    pos.x = sin(inclination) * cos(azimuth);
    pos.y = sin(inclination) * sin(azimuth);
    pos.z = cos(inclination);

    return pos;
}

XYZ normalizedCrossProduct(double a1, double a2, double a3, double b1, double b2, double b3)
{
    XYZ retval;

    retval.x = (a2 * b3 - a3 * b2);
    retval.y = -(a1 * b3 - a3 * b1);
    retval.z = (a1 * b2 - a2 * b1);

    double len = sqrt((retval.x * retval.x) + (retval.y * retval.y) + (retval.z * retval.z));
    retval.x /= len;
    retval.y /= len;
    retval.z /= len;

    return retval;
}

RGB normalRGB(double x, double y, double z)
{
    RGB color;

    color.r = (x / 2.0 + 0.5) * 255;
    color.g = (y / 2.0 + 0.5) * 255;
    color.b = (z / 2.0 + 0.5) * 255;

    return color;
}

double smootherstep(double t)
{
    return 6.0 * (pow(t, 5.0)) - 15.0 * (pow(t, 4.0)) + 10.0 * (pow(t, 3));
}

TextureGenerator::TextureGenerator()
{
    // Initialize the noise
    surfaceNoise = new NoiseWrapper(
        surfaceSeed,
        surfaceiScale,
        surfaceiOctaves,
        surfaceiFalloff,
        surfaceiIntensity,
        surfaceiRidginess,
        surfacesScale,
        surfacesOctaves,
        surfacesFalloff,
        surfacesIntensity
    );

    landNoise = new NoiseWrapper(
        landSeed,
        landiScale,
        landiOctaves,
        landiFalloff,
        landiIntensity,
        landiRidginess,
        landsScale,
        landsOctaves,
        landsFalloff,
        landsIntensity
    );

    cloudNoise = new NoiseWrapper(
        cloudSeed,
        cloudiScale,
        cloudiOctaves,
        cloudiFalloff,
        cloudiIntensity,
        cloudiRidginess,
        cloudsScale,
        cloudsOctaves,
        cloudsFalloff,
        cloudsIntensity
    );

    // Initialize the buffers
    diffuseBuffer = new unsigned char[getTextureSize(false)];
    normalBuffer = new unsigned char[getTextureSize(false)];
    specularBuffer = new unsigned char[getTextureSize(false)];
    cloudBuffer = new unsigned char[getTextureSize(true)];
}

int TextureGenerator::getTextureSize(bool isClouds)
{
    if (isClouds)
    {
        return resolution * resolution * 2; // Technically: resolutionX * (resolutionY / 2) * 4 bytes
    }

    return resolution * (resolution / 2) * 3; // Technically: resolutionX * (resolutionY / 2) * 3 bytes
}

RGB TextureGenerator::surfaceColor(double x, double y, double z)
{
    double c = landNoise->sample(
                   x,
                   y,
                   z
               );

    // Blend landColor1 and landColor2
    double q0 = c;
    double q1 = 1.0 - c;

    RGB retval;

    retval.r = landColor1.r * q0 + landColor2.r * q1;
    retval.g = landColor1.g * q0 + landColor2.g * q1;
    retval.b = landColor1.b * q0 + landColor2.b * q1;

    return retval;
}

void TextureGenerator::GenerateTextures()
{
    unsigned short int width = resolution;
    unsigned short int height = resolution / 2;   /* The texture should have a 2:1 aspect ratio to wrap properly */

    for( unsigned int x = 0; x < width; x++ )
    {
        for( unsigned int y = 0; y < height; y++ )
        {
            XYZ p0 = sphereMap(double(x) / (width - 1.0), double(y) / (height - 1.0));
            double c0 = surfaceNoise->sample(p0.x, p0.y, p0.z);
            double dr = 0.01;
            if (c0 > waterLevel)
            {
                RGB c = surfaceColor(p0.x, p0.y, p0.z);
                setPixel(
                    diffuseBuffer,
                    x,
                    y,
                    c
                );

                RGB specularC;
                specularC.r = 0;
                specularC.g = 0;
                specularC.b = 0;

                setPixel(
                    specularBuffer,
                    x,
                    y,
                    specularC
                );

                XYZ px = sphereMap((double(x) + dr) / (double(width) - 1.0), double(y) / (double(height) - 1.0));
                XYZ py = sphereMap(double(x) / (double(width) - 1.0), (double(y) + dr) / (double(height) - 1.0));
                double cx = surfaceNoise->sample(px.x, px.y, px.z);
                double cy = surfaceNoise->sample(py.x, py.y, py.z);

                XYZ n = normalizedCrossProduct(
                            dr / (double(width) - 1.0),
                            0.0,
                            (cx - c0),
                            0.0,
                            dr / (double(height) - 1.0),
                            (cy - c0)
                        );

                RGB normalPixel = normalRGB(n.x, -n.y, n.z);
                setPixel(
                    normalBuffer,
                    x,
                    y,
                    normalPixel
                );
            }
            else
            {
                double q1 = smootherstep(pow(c0 / waterLevel, waterFalloff));
                double q0 = 1.0 - q1;
                RGB rgb;
                rgb.r = waterDeep.r * q0 + waterShallow.r * q1;
                rgb.g = waterDeep.g * q0 + waterShallow.g * q1;
                rgb.b = waterDeep.b * q0 + waterShallow.b * q1;

                setPixel(
                    diffuseBuffer,
                    x,
                    y,
                    rgb
                );

                RGB waterSpecularRGB;
                waterSpecularRGB.r = waterSpecular * 255;
                waterSpecularRGB.g = waterSpecular * 255;
                waterSpecularRGB.b = waterSpecular * 255;

                setPixel(
                    specularBuffer,
                    x,
                    y,
                    waterSpecularRGB
                );

                RGB normalPixel;
                normalPixel.r = 128;
                normalPixel.g = 128;
                normalPixel.b = 255;

                setPixel(
                    normalBuffer,
                    x,
                    y,
                    normalPixel
                );
            }

            double i = cloudNoise->sample(p0.x, p0.y, p0.z) * cloudOpacity;

            setCloudPixel(
                cloudBuffer,
                x,
                y,
                cloudColor,
                i * 255
            );
        }
    }
}

void TextureGenerator::setCloudPixel(unsigned char *buffer, unsigned int x, unsigned int y, RGB color, unsigned int opacity)
{
    int index = (y * resolution * 4) + x * 4;

    buffer[index + 0] = color.r;
    buffer[index + 1] = color.g;
    buffer[index + 2] = color.b;
    buffer[index + 3] = opacity;
}

void TextureGenerator::setPixel(unsigned char *buffer, unsigned int x, unsigned int y, RGB color)
{
    int index = (y * resolution * 3) + x * 3;

    buffer[index + 0] = color.r;
    buffer[index + 1] = color.g;
    buffer[index + 2] = color.b;
}
