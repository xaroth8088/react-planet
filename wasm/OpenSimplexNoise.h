/* Based on https://github.com/deerel/OpenSimplexNoise and used under the
 * UNLICENSE */
/**
  Open Simple Noise for C++

  Port to C++ from https://gist.github.com/KdotJPG/b1270127455a94ac5d19
  by Rickard Lundberg, 2019.
*/
#pragma once

#include <array>
namespace OpenSimplexNoise {
class Noise {
   public:
    Noise();
    Noise(int64_t seed);
    // 2D Open Simplex Noise.
    double eval(const double x, const double y) const;
    // 3D Open Simplex Noise.
    double eval(double x, double y, double z) const;

   private:
    const double m_stretch2d;
    const double m_squish2d;
    const double m_stretch3d;
    const double m_squish3d;

    const double m_norm2d;
    const double m_norm3d;

    const long m_defaultSeed;

    std::array<short, 256> m_perm;
    std::array<short, 256> m_permGradIndex3d;
    std::array<char, 16> m_gradients2d;
    std::array<char, 72> m_gradients3d;
    double extrapolate(int xsb, int ysb, double dx, double dy) const;
    double extrapolate(int xsb, int ysb, int zsb, double dx, double dy,
                       double dz) const;
};
}  // namespace OpenSimplexNoise
