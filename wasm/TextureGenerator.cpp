#define _USE_MATH_DEFINES
#include <cmath>

#include <emscripten.h>
#include <emscripten/val.h>
#include <emscripten/bind.h>
#include <string>
#include <strings.h>
#include <stdlib.h>

#include "TextureGenerator.h"


using namespace emscripten;

int fls(int mask) {
    /*
        https://github.com/udp/freebsd-libc/blob/master/string/fls.c
    */
	int bit;

	if (mask == 0)
		return (0);
	for (bit = 1; mask != 1; bit++)
		mask = (unsigned int)mask >> 1;

	return (bit);
}

RGBA TextureGenerator::UL2RGBA(unsigned long dwColor) {
    RGBA tmp;

    tmp.a = 255;    // Intentionally discarding alpha channel
    tmp.b = dwColor & 0xFF; dwColor >>= 8;
    tmp.g = dwColor & 0xFF; dwColor >>= 8;
    tmp.r = dwColor & 0xFF;

    return tmp;
}

void TextureGenerator::ParseOptions(val options) {
    val opt = options["surfaceSeed"];
    if (this->isType(opt, "number")) {
        this->surfaceSeed = opt.as<double>();
    }

    opt = options["landSeed"];
    if (this->isType(opt, "number")) {
        this->landSeed = opt.as<double>();
    }

    opt = options["cloudSeed"];
    if (this->isType(opt, "number")) {
        this->cloudSeed = opt.as<double>();
    }

    opt = options["resolution"];
    if (this->isType(opt, "number")) {
        // bump up to the nearest power of 2
        unsigned int resolution = opt.as<unsigned int>();
        unsigned char powerOfTwo = fls(resolution - 1);
        if (resolution > 0) {
            this->resolution = 1 << powerOfTwo;
        }

        // The minimum resolution is 2 (otherwise the height becomes 0 when we put the textures into the 2:1 aspect ratio)
        if (this->resolution < 2) {
            this->resolution = 2;
        }
    }

    // Initialize all other configuration
    opt = options["surfaceiScale"];
    if (this->isType(opt, "number")) {
        this->surfaceiScale = opt.as<double>();
    }

    opt = options["surfaceiOctaves"];
    if (this->isType(opt, "number")) {
        this->surfaceiOctaves = opt.as<unsigned char>();
    }

    opt = options["surfaceiFalloff"];
    if (this->isType(opt, "number")) {
        this->surfaceiFalloff = opt.as<double>();
    }

    opt = options["surfaceiIntensity"];
    if (this->isType(opt, "number")) {
        this->surfaceiIntensity = opt.as<double>();
    }

    opt = options["surfaceiRidginess"];
    if (this->isType(opt, "number")) {
        this->surfaceiRidginess = opt.as<double>();
    }

    opt = options["surfacesScale"];
    if (this->isType(opt, "number")) {
        this->surfacesScale = opt.as<double>();
    }

    opt = options["surfacesOctaves"];
    if (this->isType(opt, "number")) {
        this->surfacesOctaves = opt.as<unsigned char>();
    }

    opt = options["surfacesFalloff"];
    if (this->isType(opt, "number")) {
        this->surfacesFalloff = opt.as<double>();
    }

    opt = options["surfacesIntensity"];
    if (this->isType(opt, "number")) {
        this->surfacesIntensity = opt.as<double>();
    }

    opt = options["landColor1"];
    if (this->isType(opt, "number")) {
        this->landColor1 = UL2RGBA(opt.as<int>());
    }

    opt = options["landColor2"];
    if (this->isType(opt, "number")) {
        this->landColor2 = UL2RGBA(opt.as<int>());
    }

    opt = options["landiScale"];
    if (this->isType(opt, "number")) {
        this->landiScale = opt.as<double>();
    }

    opt = options["landiOctaves"];
    if (this->isType(opt, "number")) {
        this->landiOctaves = opt.as<unsigned char>();
    }

    opt = options["landiFalloff"];
    if (this->isType(opt, "number")) {
        this->landiFalloff = opt.as<double>();
    }

    opt = options["landiIntensity"];
    if (this->isType(opt, "number")) {
        this->landiIntensity = opt.as<double>();
    }

    opt = options["landiRidginess"];
    if (this->isType(opt, "number")) {
        this->landiRidginess = opt.as<double>();
    }

    opt = options["landsScale"];
    if (this->isType(opt, "number")) {
        this->landsScale = opt.as<double>();
    }

    opt = options["landsOctaves"];
    if (this->isType(opt, "number")) {
        this->landsOctaves = opt.as<unsigned char>();
    }

    opt = options["landsFalloff"];
    if (this->isType(opt, "number")) {
        this->landsFalloff = opt.as<double>();
    }

    opt = options["landsIntensity"];
    if (this->isType(opt, "number")) {
        this->landsIntensity = opt.as<double>();
    }

    opt = options["waterDeep"];
    if (this->isType(opt, "number")) {
        this->waterDeep = UL2RGBA(opt.as<int>());
    }

    opt = options["waterShallow"];
    if (this->isType(opt, "number")) {
        this->waterShallow = UL2RGBA(opt.as<int>());
    }

    opt = options["waterLevel"];
    if (this->isType(opt, "number")) {
        this->waterLevel = opt.as<double>();
    }

    opt = options["waterSpecular"];
    if (this->isType(opt, "number")) {
        this->waterSpecular = opt.as<double>();
    }

    opt = options["waterFalloff"];
    if (this->isType(opt, "number")) {
        this->waterFalloff = opt.as<double>();
    }

    opt = options["cloudColor"];
    if (this->isType(opt, "number")) {
        this->cloudColor = UL2RGBA(opt.as<int>());
    }

    opt = options["cloudOpacity"];
    if (this->isType(opt, "number")) {
        this->cloudOpacity = opt.as<double>();
    }

    opt = options["cloudiScale"];
    if (this->isType(opt, "number")) {
        this->cloudiScale = opt.as<double>();
    }

    opt = options["cloudiOctaves"];
    if (this->isType(opt, "number")) {
        this->cloudiOctaves = opt.as<unsigned char>();
    }

    opt = options["cloudiFalloff"];
    if (this->isType(opt, "number")) {
        this->cloudiFalloff = opt.as<double>();
    }

    opt = options["cloudiIntensity"];
    if (this->isType(opt, "number")) {
        this->cloudiIntensity = opt.as<double>();
    }

    opt = options["cloudiRidginess"];
    if (this->isType(opt, "number")) {
        this->cloudiRidginess = opt.as<double>();
    }

    opt = options["cloudsScale"];
    if (this->isType(opt, "number")) {
        this->cloudsScale = opt.as<double>();
    }

    opt = options["cloudsOctaves"];
    if (this->isType(opt, "number")) {
        this->cloudsOctaves = opt.as<unsigned char>();
    }

    opt = options["cloudsFalloff"];
    if (this->isType(opt, "number")) {
        this->cloudsFalloff = opt.as<double>();
    }

    opt = options["cloudsIntensity"];
    if (this->isType(opt, "number")) {
        this->cloudsIntensity = opt.as<double>();
    }

/*
    val optComplete = options["complete"];
    if (this->isType(optComplete, "function"))
    {
        //No need to typecast, we store function callbacks as val
        //Do stuff with option value...
    }
    */
}

TextureGenerator::TextureGenerator(val options) {
    this->ParseOptions(options);

    // Initialize the noise
    this->surfaceNoise = new NoiseWrapper(
        this->surfaceSeed,
        this->surfaceiScale,
        this->surfaceiOctaves,
        this->surfaceiFalloff,
        this->surfaceiIntensity,
        this->surfaceiRidginess,
        this->surfacesScale,
        this->surfacesOctaves,
        this->surfacesFalloff,
        this->surfacesIntensity
    );

    this->landNoise = new NoiseWrapper(
        this->landSeed,
        this->landiScale,
        this->landiOctaves,
        this->landiFalloff,
        this->landiIntensity,
        this->landiRidginess,
        this->landsScale,
        this->landsOctaves,
        this->landsFalloff,
        this->landsIntensity
    );

    this->cloudNoise = new NoiseWrapper(
        this->cloudSeed,
        this->cloudiScale,
        this->cloudiOctaves,
        this->cloudiFalloff,
        this->cloudiIntensity,
        this->cloudiRidginess,
        this->cloudsScale,
        this->cloudsOctaves,
        this->cloudsFalloff,
        this->cloudsIntensity
    );

    // Initialize the buffers
    this->diffuseBuffer = new unsigned char[resolution * resolution * 2];
    this->normalBuffer = new unsigned char[resolution * resolution * 2];
    this->specularBuffer = new unsigned char[resolution * resolution * 2];
    this->cloudBuffer = new unsigned char[resolution * resolution * 2];
}

double TextureGenerator::surfaceHeight(double x, double y, double z) {
    return this->surfaceNoise->sample(x, y, z);
}

RGBA TextureGenerator::surfaceColor(double x, double y, double z) {
    double c = this->landNoise->sample(
        x,
        y,
        z
    );

    // Blend landColor1 and landColor2
    double q0 = c;
    double q1 = 1.0 - c;

    RGBA retval;

    retval.r = this->landColor1.r * q0 + this->landColor2.r * q1;
    retval.g = this->landColor1.g * q0 + this->landColor2.g * q1;
    retval.b = this->landColor1.b * q0 + this->landColor2.b * q1;
    retval.a = 255;

    return retval;
}

XYZ TextureGenerator::sphereMap(double u, double v) {
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

XYZ TextureGenerator::normalizedCrossProduct(double a1, double a2, double a3, double b1, double b2, double b3) {
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

void TextureGenerator::GenerateTextures() {
    unsigned short int width = this->resolution;
    unsigned short int height = this->resolution / 2;   /* The texture should have a 2:1 aspect ratio to wrap properly */

    for( unsigned int x = 0; x < width; x++ ) {
        for( unsigned int y = 0; y < height; y++ ) {
            XYZ p0 = this->sphereMap(double(x) / (width - 1.0), double(y) / (height - 1.0));
            double c0 = this->surfaceHeight(p0.x, p0.y, p0.z);
            double dr = 0.01;
            if (c0 > this->waterLevel) {
                RGBA c = this->surfaceColor(p0.x, p0.y, p0.z);
                this->setPixel(
                    this->diffuseBuffer,
                    x,
                    y,
                    c
                );

                RGBA specularC;
                specularC.r = 0;
                specularC.g = 0;
                specularC.b = 0;
                specularC.a = 255;

                this->setPixel(
                    this->specularBuffer,
                    x,
                    y,
                    specularC
                );

                XYZ px = this->sphereMap((double(x) + dr) / (double(width) - 1.0), double(y) / (double(height) - 1.0));
                XYZ py = this->sphereMap(double(x) / (double(width) - 1.0), (double(y) + dr) / (double(height) - 1.0));
                double cx = this->surfaceHeight(px.x, px.y, px.z);
                double cy = this->surfaceHeight(py.x, py.y, py.z);

                XYZ n = this->normalizedCrossProduct(
                    dr / (double(width) - 1.0),
                    0.0,
                    (cx - c0),
                    0.0,
                    dr / (double(height) - 1.0),
                    (cy - c0)
                );

                RGBA normalPixel = this->normalRGBA(n.x, -n.y, n.z);
                this->setPixel(
                    this->normalBuffer,
                    x,
                    y,
                    normalPixel
                );
            } else {
                double q1 = this->smootherstep(pow(c0 / this->waterLevel, this->waterFalloff));
                double q0 = 1.0 - q1;
                RGBA rgb;
                rgb.r = waterDeep.r * q0 + waterShallow.r * q1;
                rgb.g = waterDeep.g * q0 + waterShallow.g * q1;
                rgb.b = waterDeep.b * q0 + waterShallow.b * q1;
                rgb.a = 255;

                this->setPixel(
                    this->diffuseBuffer,
                    x,
                    y,
                    rgb
                );

                RGBA waterSpecularRGBA;
                waterSpecularRGBA.r = this->waterSpecular * 255;
                waterSpecularRGBA.g = this->waterSpecular * 255;
                waterSpecularRGBA.b = this->waterSpecular * 255;
                waterSpecularRGBA.a = 255;
                this->setPixel(
                    this->specularBuffer,
                    x,
                    y,
                    waterSpecularRGBA
                );

                RGBA normalPixel;
                normalPixel.r = 128;
                normalPixel.g = 128;
                normalPixel.b = 255;
                normalPixel.a = 255;
                this->setPixel(
                    this->normalBuffer,
                    x,
                    y,
                    normalPixel
                );
            }

            double i = this->cloudNoise->sample(p0.x, p0.y, p0.z) * this->cloudOpacity;
            this->cloudColor.a = i * 255;

            this->setPixel(
                this->cloudBuffer,
                x,
                y,
                this->cloudColor
            );
        }
    }
}

void TextureGenerator::setPixel(unsigned char* buffer, unsigned int x, unsigned int y, RGBA color) {
    int index = (y * this->resolution * 4) + x * 4;

    buffer[index + 0] = color.r;
    buffer[index + 1] = color.g;
    buffer[index + 2] = color.b;
    buffer[index + 3] = color.a;
}

double TextureGenerator::smootherstep(double t) {
    return 6.0 * (pow(t, 5.0)) - 15.0 * (pow(t, 4.0)) + 10.0 * (pow(t, 3));
}

RGBA TextureGenerator::normalRGBA(double x, double y, double z) {
    RGBA color;

    color.r = (x / 2.0 + 0.5) * 255;
    color.g = (y / 2.0 + 0.5) * 255;
    color.b = (z / 2.0 + 0.5) * 255;
    color.a = 255;

    return color;
}

val TextureGenerator::getDiffuseTexture() {
    return val(typed_memory_view(2 * this->resolution * this->resolution, this->diffuseBuffer));
}

val TextureGenerator::getNormalTexture() {
    return val(typed_memory_view(2 * this->resolution * this->resolution, this->normalBuffer));
}

val TextureGenerator::getSpecularTexture() {
    return val(typed_memory_view(2 * this->resolution * this->resolution, this->specularBuffer));
}

val TextureGenerator::getCloudTexture() {
    return val(typed_memory_view(2 * this->resolution * this->resolution, this->cloudBuffer));
}
