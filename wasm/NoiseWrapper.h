#pragma once

#include "OpenSimplexNoise.h"

class NoiseWrapper {
   public:
    NoiseWrapper(double seed, double iScale, unsigned char iOctaves,
                 double iFalloff, double iIntensity, double iRidginess,
                 double sScale, unsigned char sOctaves, double sFalloff,
                 double sIntensity);
    ~NoiseWrapper();

    double sample(double x, double y, double z);

   private:
    OpenSimplexNoise *noise;
    double seed;
    double iScale;
    unsigned char iOctaves;
    double iFalloff;
    double iIntensity;
    double iRidginess;
    double sScale;
    unsigned char sOctaves;
    double sFalloff;
    double sIntensity;

    double getOctave(double x, double y, double z, unsigned char octaves);
    double getNormalizedOctave(double x, double y, double z,
                               unsigned char octaves);
    double ridgify(double value);
};
