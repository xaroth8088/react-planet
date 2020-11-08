#include "OpenSimplexNoise.h"

const double OpenSimplexNoise::STRETCH_3D = -1.0 / 6.0;
const double OpenSimplexNoise::SQUISH_3D = 1.0 / 3.0;
const double OpenSimplexNoise::NORM_3D = 1.0 / 103.0;

std::array<double, 72> OpenSimplexNoise::gradients3D;

std::vector<OpenSimplexNoise::Contribution3*> OpenSimplexNoise::lookup3D;

std::vector<OpenSimplexNoise::pContribution3> OpenSimplexNoise::contributions3D;

// Initialise our static tables
OpenSimplexNoise::StaticConstructor OpenSimplexNoise::staticConstructor;
