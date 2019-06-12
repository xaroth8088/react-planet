#include "OpenSimplexNoise.h"

const double OpenSimplexNoise::STRETCH_2D = -0.211324865405187;
const double OpenSimplexNoise::STRETCH_3D = -1.0 / 6.0;
const double OpenSimplexNoise::STRETCH_4D = -0.138196601125011;
const double OpenSimplexNoise::SQUISH_2D = 0.366025403784439;
const double OpenSimplexNoise::SQUISH_3D = 1.0 / 3.0;
const double OpenSimplexNoise::SQUISH_4D = 0.309016994374947;
const double OpenSimplexNoise::NORM_2D = 1.0 / 47.0;
const double OpenSimplexNoise::NORM_3D = 1.0 / 103.0;
const double OpenSimplexNoise::NORM_4D = 1.0 / 30.0;

std::array<double, 16> OpenSimplexNoise::gradients2D;
std::array<double, 72> OpenSimplexNoise::gradients3D;
std::array<double, 256> OpenSimplexNoise::gradients4D;

std::vector<OpenSimplexNoise::Contribution2*> OpenSimplexNoise::lookup2D;
std::vector<OpenSimplexNoise::Contribution3*> OpenSimplexNoise::lookup3D;
std::vector<OpenSimplexNoise::Contribution4*> OpenSimplexNoise::lookup4D;

std::vector<OpenSimplexNoise::pContribution2> OpenSimplexNoise::contributions2D;
std::vector<OpenSimplexNoise::pContribution3> OpenSimplexNoise::contributions3D;
std::vector<OpenSimplexNoise::pContribution4> OpenSimplexNoise::contributions4D;

// Initialise our static tables
OpenSimplexNoise::StaticConstructor OpenSimplexNoise::staticConstructor;
