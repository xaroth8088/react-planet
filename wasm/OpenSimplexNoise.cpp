#include "OpenSimplexNoise.h"

const double OpenSimplexNoise::STRETCH_2D = -0.211324865405187;
const double OpenSimplexNoise::STRETCH_3D = -1.0 / 6.0;
const double OpenSimplexNoise::SQUISH_2D = 0.366025403784439;
const double OpenSimplexNoise::SQUISH_3D = 1.0 / 3.0;
const double OpenSimplexNoise::NORM_2D = 1.0 / 47.0;
const double OpenSimplexNoise::NORM_3D = 1.0 / 103.0;

std::array<double, 16> OpenSimplexNoise::gradients2D;
std::array<double, 72> OpenSimplexNoise::gradients3D;

std::vector<OpenSimplexNoise::Contribution2*> OpenSimplexNoise::lookup2D;
std::vector<OpenSimplexNoise::Contribution3*> OpenSimplexNoise::lookup3D;

std::vector<OpenSimplexNoise::pContribution2> OpenSimplexNoise::contributions2D;
std::vector<OpenSimplexNoise::pContribution3> OpenSimplexNoise::contributions3D;

// Initialise our static tables
OpenSimplexNoise::StaticConstructor OpenSimplexNoise::staticConstructor;
