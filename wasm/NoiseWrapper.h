#pragma once

#include "DataTypes.h"
#include "OpenSimplexNoise.h"

class NoiseWrapper {
   public:
    NoiseWrapper(float seed, float iScale, unsigned char iOctaves,
                 float iFalloff, float iIntensity, float iRidginess,
                 float sScale, unsigned char sOctaves, float sFalloff,
                 float sIntensity);
    ~NoiseWrapper();

    float sample(XYZ p);

   private:
    OpenSimplexNoise *noise;
    float seed;
    float iScale;
    unsigned char iOctaves;
    float iFalloff;
    float iIntensity;
    float iRidginess;
    float sScale;
    unsigned char sOctaves;
    float sFalloff;
    float sIntensity;

    float getOctave(XYZ p0, unsigned char octaves);
    float getNormalizedOctave(XYZ p0, unsigned char octaves);
    float ridgify(float value);
};
