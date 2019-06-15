#pragma once
/*******************************************************************************
 OpenSimplex Noise in C++
 Ported from https://gist.github.com/digitalshadow/134a3a02b67cecd72181
 Originally from https://gist.github.com/KdotJPG/b1270127455a94ac5d19
 Optimised by DigitalShadow
 This version by Mark A. Ropper (Markyparky56)
 Used under the UNLICENSE
 *******************************************************************************/
#include <array>
#include <memory>  // unique_ptr
#include <vector>

#if defined(__clang__)  // Couldn't find one for clang
#define FORCE_INLINE inline
#elif defined(__GNUC__) || defined(__GNUG__)
#define FORCE_INLINE __attribute__((always_inline))
#elif defined(_MSC_VER)
#define FORCE_INLINE __forceinline
#endif

class OpenSimplexNoise {
    friend class StaticConstructor;

   protected:
    // Contribution structs
    struct Contribution2 {
       public:
        double dx, dy;
        int xsb, ysb;
        Contribution2 *Next;

        Contribution2(double multiplier, int _xsb, int _ysb)
            : xsb(_xsb), ysb(_ysb), Next(nullptr) {
            dx = -_xsb - multiplier * SQUISH_2D;
            dy = -_ysb - multiplier * SQUISH_2D;
        }
        ~Contribution2() {
            if (Next != nullptr) {
                delete Next;
            }
        }
    };
    using pContribution2 = std::unique_ptr<Contribution2>;
    struct Contribution3 {
       public:
        double dx, dy, dz;
        int xsb, ysb, zsb;
        Contribution3 *Next;

        Contribution3(double multiplier, int _xsb, int _ysb, int _zsb)
            : xsb(_xsb), ysb(_ysb), zsb(_zsb), Next(nullptr) {
            dx = -xsb - multiplier * SQUISH_3D;
            dy = -ysb - multiplier * SQUISH_3D;
            dz = -zsb - multiplier * SQUISH_3D;
        }
        ~Contribution3() {
            if (Next != nullptr) {
                delete Next;
            }
        }
    };
    using pContribution3 = std::unique_ptr<Contribution3>;

    // Constants
    static const double STRETCH_2D;
    static const double STRETCH_3D;
    static const double SQUISH_2D;
    static const double SQUISH_3D;
    static const double NORM_2D;
    static const double NORM_3D;

    std::array<unsigned char, 256> perm;
    std::array<unsigned char, 256> perm2D;
    std::array<unsigned char, 256> perm3D;

    static std::array<double, 16> gradients2D;
    static std::array<double, 72> gradients3D;

    static std::vector<Contribution2 *> lookup2D;
    static std::vector<Contribution3 *> lookup3D;

    static std::vector<pContribution2> contributions2D;
    static std::vector<pContribution3> contributions3D;

    struct StaticConstructor {
        StaticConstructor() {
            gradients2D = {
                5, 2, 2, 5, -5, 2, -2, 5, 5, -2, 2, -5, -5, -2, -2, -5,
            };
            gradients3D = {
                -11, 4,  4,   -4, 11, 4,   -4,  4,   11,  11, 4,   4,
                4,   11, 4,   4,  4,  11,  -11, -4,  4,   -4, -11, 4,
                -4,  -4, 11,  11, -4, 4,   4,   -11, 4,   4,  -4,  11,
                -11, 4,  -4,  -4, 11, -4,  -4,  4,   -11, 11, 4,   -4,
                4,   11, -4,  4,  4,  -11, -11, -4,  -4,  -4, -11, -4,
                -4,  -4, -11, 11, -4, -4,  4,   -11, -4,  4,  -4,  -11,
            };

            // Create Contribution2s for lookup2D
            std::vector<std::vector<int>> base2D = {
                {1, 1, 0, 1, 0, 1, 0, 0, 0}, {1, 1, 0, 1, 0, 1, 2, 1, 1}};
            std::vector<int> p2D = {0, 0, 1, -1, 0, 0, -1, 1, 0, 2, 1, 1,
                                    1, 2, 2, 0,  1, 2, 0,  2, 1, 0, 0, 0};
            std::vector<int> lookupPairs2D = {0,  1, 1,  0, 4,  1, 17, 0,
                                              20, 2, 21, 2, 22, 5, 23, 5,
                                              26, 4, 39, 3, 42, 4, 43, 3};

            contributions2D.resize(6);
            for (int i = 0; i < static_cast<int>(p2D.size()); i += 4) {
                std::vector<int> baseSet = base2D[p2D[i]];
                Contribution2 *previous = nullptr, *current = nullptr;
                for (int k = 0; k < static_cast<int>(baseSet.size()); k += 3) {
                    current = new Contribution2(baseSet[k], baseSet[k + 1],
                                                baseSet[k + 2]);
                    if (previous == nullptr) {
                        contributions2D[i / 4].reset(current);
                    } else {
                        previous->Next = current;
                    }
                    previous = current;
                }
                current->Next =
                    new Contribution2(p2D[i + 1], p2D[i + 2], p2D[i + 3]);
            }

            lookup2D.resize(64);
            for (int i = 0; i < static_cast<int>(lookupPairs2D.size());
                 i += 2) {
                lookup2D[lookupPairs2D[i]] =
                    contributions2D[lookupPairs2D[i + 1]].get();
            }

            // Create Contribution3s for lookup3D
            std::vector<std::vector<int>> base3D = {
                {0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1},
                {2, 1, 1, 0, 2, 1, 0, 1, 2, 0, 1, 1, 3, 1, 1, 1},
                {1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1,
                 2, 1, 1, 0, 2, 1, 0, 1, 2, 0, 1, 1}};
            std::vector<int> p3D = {
                0, 0, 1,  -1, 0,  0, 1, 0,  -1, 0, 0, -1, 1,  0,  0, 0,  1, -1,
                0, 0, -1, 0,  1,  0, 0, -1, 1,  0, 2, 1,  1,  0,  1, 1,  1, -1,
                0, 2, 1,  0,  1,  1, 1, -1, 1,  0, 2, 0,  1,  1,  1, -1, 1, 1,
                1, 3, 2,  1,  0,  3, 1, 2,  0,  1, 3, 2,  0,  1,  3, 1,  0, 2,
                1, 3, 0,  2,  1,  3, 0, 1,  2,  1, 1, 1,  0,  0,  2, 2,  0, 0,
                1, 1, 0,  1,  0,  2, 0, 2,  0,  1, 1, 0,  0,  1,  2, 0,  0, 2,
                2, 0, 0,  0,  0,  1, 1, -1, 1,  2, 0, 0,  0,  0,  1, -1, 1, 1,
                2, 0, 0,  0,  0,  1, 1, 1,  -1, 2, 3, 1,  1,  1,  2, 0,  0, 2,
                2, 3, 1,  1,  1,  2, 2, 0,  0,  2, 3, 1,  1,  1,  2, 0,  2, 0,
                2, 1, 1,  -1, 1,  2, 0, 0,  2,  2, 1, 1,  -1, 1,  2, 2,  0, 0,
                2, 1, -1, 1,  1,  2, 0, 0,  2,  2, 1, -1, 1,  1,  2, 0,  2, 0,
                2, 1, 1,  1,  -1, 2, 2, 0,  0,  2, 1, 1,  1,  -1, 2, 0,  2, 0};
            std::vector<int> lookupPairs3D = {
                0,    2,  1,    1,  2,    2,  5,    1,  6,    0,  7,    0,
                32,   2,  34,   2,  129,  1,  133,  1,  160,  5,  161,  5,
                518,  0,  519,  0,  546,  4,  550,  4,  645,  3,  647,  3,
                672,  5,  673,  5,  674,  4,  677,  3,  678,  4,  679,  3,
                680,  13, 681,  13, 682,  12, 685,  14, 686,  12, 687,  14,
                712,  20, 714,  18, 809,  21, 813,  23, 840,  20, 841,  21,
                1198, 19, 1199, 22, 1226, 18, 1230, 19, 1325, 23, 1327, 22,
                1352, 15, 1353, 17, 1354, 15, 1357, 17, 1358, 16, 1359, 16,
                1360, 11, 1361, 10, 1362, 11, 1365, 10, 1366, 9,  1367, 9,
                1392, 11, 1394, 11, 1489, 10, 1493, 10, 1520, 8,  1521, 8,
                1878, 9,  1879, 9,  1906, 7,  1910, 7,  2005, 6,  2007, 6,
                2032, 8,  2033, 8,  2034, 7,  2037, 6,  2038, 7,  2039, 6};

            contributions3D.resize(p3D.size() / 9);
            for (int i = 0; i < static_cast<int>(p3D.size()); i += 9) {
                auto baseSet = base3D[p3D[i]];
                Contribution3 *previous = nullptr, *current = nullptr;
                for (int k = 0; k < static_cast<int>(baseSet.size()); k += 4) {
                    current = new Contribution3(baseSet[k], baseSet[k + 1],
                                                baseSet[k + 2], baseSet[k + 3]);
                    if (previous == nullptr) {
                        contributions3D[i / 9] = pContribution3(current);
                    } else {
                        previous->Next = current;
                    }
                    previous = current;
                }
                current->Next = new Contribution3(p3D[i + 1], p3D[i + 2],
                                                  p3D[i + 3], p3D[i + 4]);
                current->Next->Next = new Contribution3(p3D[i + 5], p3D[i + 6],
                                                        p3D[i + 7], p3D[i + 8]);
            }

            lookup3D.resize(2048);
            for (int i = 0; i < static_cast<int>(lookupPairs3D.size());
                 i += 2) {
                lookup3D[lookupPairs3D[i]] =
                    contributions3D[lookupPairs3D[i + 1]].get();
            }
        }
    };
    static StaticConstructor staticConstructor;

    FORCE_INLINE static int FastFloor(double x) {
        int xi = static_cast<int>(x);
        return x < xi ? xi - 1 : xi;
    }

   public:
    OpenSimplexNoise(int64_t seed) {
        std::array<char, 256> source;
        for (int i = 0; i < 256; i++) {
            source[i] = i;
        }
        seed = seed * 6364136223846793005L + 1442695040888963407L;
        seed = seed * 6364136223846793005L + 1442695040888963407L;
        seed = seed * 6364136223846793005L + 1442695040888963407L;
        for (int i = 255; i >= 0; i--) {
            seed = seed * 6364136223846793005L + 1442695040888963407L;
            int r = static_cast<int>((seed + 31) % (i + 1));
            if (r < 0) {
                r += (i + 1);
            }
            perm[i] = source[r];
            perm2D[i] = perm[i] & 0x0E;
            perm3D[i] = (perm[i] % 24) * 3;
            source[r] = source[i];
        }
    }

    double Evaluate(double x, double y) {
        double stretchOffset = (x + y) * STRETCH_2D;
        double xs = x + stretchOffset;
        double ys = y + stretchOffset;

        int xsb = FastFloor(xs);
        int ysb = FastFloor(ys);

        double squishOffset = (xsb + ysb) * SQUISH_2D;
        double dx0 = x - (xsb + squishOffset);
        double dy0 = y - (ysb + squishOffset);

        double xins = xs - xsb;
        double yins = ys - ysb;

        double inSum = xins + yins;
        int hash = static_cast<int>(xins - yins + 1) |
                   static_cast<int>(inSum) << 1 |
                   static_cast<int>(inSum + yins) << 2 |
                   static_cast<int>(inSum + xins) << 4;

        Contribution2 *c = lookup2D[hash];

        double value = 0.0;
        while (c != nullptr) {
            double dx = dx0 + c->dx;
            double dy = dy0 + c->dy;
            double attn = 2 - dx * dx - dy * dy;
            if (attn > 0) {
                int px = xsb + c->xsb;
                int py = ysb + c->ysb;

                int i = perm2D[(perm[px & 0xFF] + py) & 0xFF];
                double valuePart =
                    gradients2D[i] * dx + gradients2D[i + 1] * dy;

                attn *= attn;
                value += attn * attn * valuePart;
            }
            c = c->Next;
        }

        return value * NORM_2D;
    }

    double Evaluate(double x, double y, double z) {
        double stretchOffset = (x + y + z) * STRETCH_3D;
        double xs = x + stretchOffset;
        double ys = y + stretchOffset;
        double zs = z + stretchOffset;

        int xsb = FastFloor(xs);
        int ysb = FastFloor(ys);
        int zsb = FastFloor(zs);

        double squishOffset = (xsb + ysb + zsb) * SQUISH_3D;
        double dx0 = x - (xsb + squishOffset);
        double dy0 = y - (ysb + squishOffset);
        double dz0 = z - (zsb + squishOffset);

        double xins = xs - xsb;
        double yins = ys - ysb;
        double zins = zs - zsb;

        double inSum = xins + yins + zins;
        int hash = static_cast<int>(yins - zins + 1) |
                   static_cast<int>(xins - yins + 1) << 1 |
                   static_cast<int>(xins - zins + 1) << 2 |
                   static_cast<int>(inSum) << 3 |
                   static_cast<int>(inSum + zins) << 5 |
                   static_cast<int>(inSum + yins) << 7 |
                   static_cast<int>(inSum + xins) << 9;

        Contribution3 *c = lookup3D[hash];

        double value = 0.0;
        while (c != nullptr) {
            double dx = dx0 + c->dx;
            double dy = dy0 + c->dy;
            double dz = dz0 + c->dz;

            double attn = 2 - dx * dx - dy * dy - dz * dz;
            if (attn > 0) {
                int px = xsb + c->xsb;
                int py = ysb + c->ysb;
                int pz = zsb + c->zsb;

                int i =
                    perm3D[(perm[(perm[px & 0xFF] + py) & 0xFF] + pz) & 0xFF];
                double valuePart = gradients3D[i] * dx +
                                   gradients3D[i + 1] * dy +
                                   gradients3D[i + 2] * dz;

                attn *= attn;
                value += attn * attn * valuePart;
            }
            c = c->Next;
        }

        return value * NORM_3D;
    }
};
