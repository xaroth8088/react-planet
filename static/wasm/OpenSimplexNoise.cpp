#include "OpenSimplexNoise.h"

const float OpenSimplexNoise::STRETCH_3D = -1.0 / 6.0;
const float OpenSimplexNoise::SQUISH_3D = 1.0 / 3.0;
const float OpenSimplexNoise::NORM_3D = 1.0 / 103.0;

std::array<float, 72> OpenSimplexNoise::gradients3D;

std::vector<OpenSimplexNoise::Contribution3*> OpenSimplexNoise::lookup3D;

std::vector<OpenSimplexNoise::pContribution3> OpenSimplexNoise::contributions3D;

// Initialise our static tables
OpenSimplexNoise::StaticConstructor OpenSimplexNoise::staticConstructor;
