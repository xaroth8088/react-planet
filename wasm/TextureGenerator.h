#pragma once

#include <emscripten/bind.h>
#include <stdlib.h>
#include "NoiseWrapper.h"

using namespace emscripten;

struct RGB
{
    unsigned char r, g, b;
};

struct XYZ
{
    double x, y, z;
};

class TextureGenerator
{

private:
    //Determines if a JS value is of the specified type
    //If a property does not exist, we will see it as undefined
    bool isType(val value, const std::string &type)
    {
        return (value.typeof().as<std::string>() == type);
    }

    double surfaceSeed = 0;
    double landSeed = 1;
    double cloudSeed = 2;

    unsigned int resolution = 256;

    double surfaceiScale = 2;
    unsigned char surfaceiOctaves = 8;
    double surfaceiFalloff = 1;
    double surfaceiIntensity = 1;
    double surfaceiRidginess = 0.5;
    double surfacesScale = 1;
    unsigned char surfacesOctaves = 0;
    double surfacesFalloff = 1;
    double surfacesIntensity = 1;

    RGB landColor1 = UL2RGB(0xe6af7e);
    RGB landColor2 = UL2RGB(0x007200);
    double landiScale = 2;
    unsigned char landiOctaves = 1;
    double landiFalloff = 1;
    double landiIntensity = 1;
    double landiRidginess = 0;
    double landsScale = 2;
    unsigned char landsOctaves = 0;
    double landsFalloff = 1;
    double landsIntensity = 1;

    RGB waterDeep = UL2RGB(0x000033);
    RGB waterShallow = UL2RGB(0x0000ff);
    double waterLevel = 0.68;
    double waterSpecular = 1;
    double waterFalloff = 1;

    RGB cloudColor = UL2RGB(0xffffff);
    double cloudOpacity = 0.75;
    double cloudiScale = 0.5;
    unsigned char cloudiOctaves = 2;
    double cloudiFalloff = 2;
    double cloudiIntensity = 1.8;
    double cloudiRidginess = 0;
    double cloudsScale = 0.5;
    unsigned char cloudsOctaves = 5;
    double cloudsFalloff = 1;
    double cloudsIntensity = 1;

    unsigned char *diffuseBuffer;
    unsigned char *normalBuffer;
    unsigned char *specularBuffer;
    unsigned char *cloudBuffer;

    NoiseWrapper *surfaceNoise;
    NoiseWrapper *landNoise;
    NoiseWrapper *cloudNoise;

    RGB surfaceColor(double x, double y, double z);
    RGB UL2RGB(unsigned long dwColor);
    void setPixel(unsigned char *buffer, unsigned int x, unsigned int y, RGB color);
    void setCloudPixel(unsigned char *buffer, unsigned int x, unsigned int y, RGB color, unsigned int opacity);
    void ParseOptions(val options);
    int getTextureSize(bool isClouds);

public:
    TextureGenerator(val options);

    void GenerateTextures();
    val getDiffuseTexture();
    val getNormalTexture();
    val getSpecularTexture();
    val getCloudTexture();

};
