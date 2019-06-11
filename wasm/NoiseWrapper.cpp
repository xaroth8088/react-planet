#include <cmath>
#include <algorithm>
#include "NoiseWrapper.h"

NoiseWrapper::NoiseWrapper(
    double seed,
    double iScale,
    unsigned char iOctaves,
    double iFalloff,
    double iIntensity,
    double iRidginess,
    double sScale,
    unsigned char sOctaves,
    double sFalloff,
    double sIntensity
)
    :
    iScale(iScale),
    iOctaves(iOctaves),
    iFalloff(iFalloff),
    iIntensity(iIntensity),
    iRidginess(iRidginess),
    sScale(sScale),
    sOctaves(sOctaves),
    sFalloff(sFalloff),
    sIntensity(sIntensity)
{
    noise = new Noise(seed);
};

double NoiseWrapper::getOctave(double x, double y, double z, unsigned char octaves)
{
    double val = 0;
    double scale = 1;

    for (unsigned char i = 0; i < octaves; i++)
    {
        val += (0.5 + noise->eval(x * scale, y * scale, z * scale)) / scale;
        scale *= 2.0;
    }

    return val;
}

double NoiseWrapper::getNormalizedOctave(double x, double y, double z, unsigned char octaves)
{
    double q = 2.0 - ( 1.0 / (std::pow(2.0, (octaves - 1.0))) );
    return getOctave(x, y, z, octaves) / q;
}

double NoiseWrapper::ridgify(double value)
{
    return 1.0 - (2.0 * abs(value - 0.5));
}

double NoiseWrapper::sample(
    double x,
    double y,
    double z
)
{
    double offset = 0.0;

    if (sOctaves > 0)
    {
        offset = getOctave(
                     x / sScale,
                     y / sScale,
                     z / sScale,
                     sOctaves
                 );

        offset = std::pow( offset, sFalloff );
        offset *= sIntensity;
    }

    double value = getNormalizedOctave(
                       x / iScale + offset,
                       y / iScale + offset,
                       z / iScale + offset,
                       iOctaves
                   );

    if (iRidginess > 0.0)
    {
        double ridge = getNormalizedOctave(
                           x / iScale + offset,
                           y / iScale + offset,
                           z / iScale + offset + 11.0,
                           iOctaves
                       );

        value = iRidginess * ridgify(ridge) + (1.0 - iRidginess) * value;
    }

    value = std::pow( value, iFalloff );
    value = std::max(0.0, std::min(1.0, value * iIntensity));

    return value;
}
