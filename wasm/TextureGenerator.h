#pragma once

#include <stdlib.h>
#include "DataTypes.h"
#include "NoiseWrapper.h"

class TextureGenerator {
   public:
    ~TextureGenerator();

    float surfaceSeed = 0;
    float landSeed = 1;
    float cloudSeed = 2;

    unsigned int resolution = 256;

    float surfaceiScale = 2;
    unsigned char surfaceiOctaves = 8;
    float surfaceiFalloff = 1;
    float surfaceiIntensity = 1;
    float surfaceiRidginess = 0.5;
    float surfacesScale = 1;
    unsigned char surfacesOctaves = 0;
    float surfacesFalloff = 1;
    float surfacesIntensity = 1;

    RGB landColor1 = UL2RGB(0xe6af7e);
    RGB landColor2 = UL2RGB(0x007200);
    float landiScale = 2;
    unsigned char landiOctaves = 1;
    float landiFalloff = 1;
    float landiIntensity = 1;
    float landiRidginess = 0;
    float landsScale = 2;
    unsigned char landsOctaves = 0;
    float landsFalloff = 1;
    float landsIntensity = 1;

    RGB waterDeep = UL2RGB(0x000033);
    RGB waterShallow = UL2RGB(0x0000ff);
    float waterLevel = 0.68;
    float waterSpecular = 1;
    float waterFalloff = 1;

    RGB cloudColor = UL2RGB(0xffffff);
    float cloudOpacity = 0.75;
    float cloudiScale = 0.5;
    unsigned char cloudiOctaves = 2;
    float cloudiFalloff = 2;
    float cloudiIntensity = 1.8;
    float cloudiRidginess = 0;
    float cloudsScale = 0.5;
    unsigned char cloudsOctaves = 5;
    float cloudsFalloff = 1;
    float cloudsIntensity = 1;

    unsigned char *diffuseBuffer;
    unsigned char *normalBuffer;
    unsigned char *specularBuffer;
    unsigned char *cloudBuffer;

    NoiseWrapper *surfaceNoise;
    NoiseWrapper *landNoise;
    NoiseWrapper *cloudNoise;

    void init();
    RGB surfaceColor(XYZ p);
    RGB UL2RGB(unsigned long dwColor);
    void setPixel(unsigned char *buffer, unsigned int x, unsigned int y,
                  RGB color);
    void setCloudPixel(unsigned char *buffer, unsigned int x, unsigned int y,
                       RGB color, unsigned int opacity);
    unsigned long int getTextureSize(bool isClouds);

    void GenerateTextures();
};
