#pragma once

#include "OpenSimplexNoise.h"

class NoiseWrapper {
   public:
    NoiseWrapper(float seed, float iScale, unsigned char iOctaves,
                 float iFalloff, float iIntensity, float iRidginess,
                 float sScale, unsigned char sOctaves, float sFalloff,
                 float sIntensity);
    ~NoiseWrapper();

    float sample(float x, float y, float z);

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

    float getOctave(float x, float y, float z, unsigned char octaves);
    float getNormalizedOctave(float x, float y, float z,
                               unsigned char octaves);
    float ridgify(float value);
};
