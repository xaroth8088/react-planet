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

    float sample(Point p);

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

    float getOctave(Point p0, unsigned char octaves);
    float getNormalizedOctave(Point p0, unsigned char octaves);
    float ridgify(float value);
};
