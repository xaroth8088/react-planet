#pragma once

#include "OpenSimplexNoise.h"

using namespace OpenSimplexNoise;

class NoiseWrapper {
public:
    NoiseWrapper(double seed, double iScale, unsigned char iOctaves,
                 double iFalloff, double iIntensity, double iRidginess,
                 double sScale, unsigned char sOctaves, double sFalloff,
                 double sIntensity);
    double sample(double x, double y, double z);
    
private:
    Noise *noise;
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
