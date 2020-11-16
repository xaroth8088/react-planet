#pragma once
/*******************************************************************************
 OpenSimplex Noise in C++
 Ported from https://gist.github.com/digitalshadow/134a3a02b67cecd72181
 Originally from https://gist.github.com/KdotJPG/b1270127455a94ac5d19
 Optimised by DigitalShadow
 Converted by Mark A. Ropper (Markyparky56)
 Modified by Geoff Benson (xaroth8088)
 Used under the UNLICENSE
 *******************************************************************************/
#include <array>
#include <memory>  // unique_ptr
#include <vector>
#include <math.h>
#include <iostream>

#include "DataTypes.h"

class OpenSimplexNoise {
    friend class StaticConstructor;

   protected:
    // Contribution structs
    struct Contribution3 {
        public:
            XYZ d;
            iXYZ sb;
            Contribution3 *Next;

            Contribution3(float multiplier, iXYZ _sb) : sb(_sb), Next(nullptr) {
                d = {
                    -sb.x - multiplier * SQUISH_3D,
                    -sb.y - multiplier * SQUISH_3D,
                    -sb.z - multiplier * SQUISH_3D
                };
            }
            ~Contribution3() {
                if (Next != nullptr) {
                    delete Next;
                }
            }
    };
    using pContribution3 = std::unique_ptr<Contribution3>;

    // Constants
    static const float STRETCH_3D;
    static const float SQUISH_3D;
    static const float NORM_3D;

    std::array<unsigned char, 256> perm;
    std::array<unsigned char, 256> perm3D;

    static std::array<float, 72> gradients3D;

    static std::vector<Contribution3 *> lookup3D;

    static std::vector<pContribution3> contributions3D;

    struct StaticConstructor {
        StaticConstructor() {
            gradients3D = {
                -11, 4,  4,   -4, 11, 4,   -4,  4,   11,  11, 4,   4,
                4,   11, 4,   4,  4,  11,  -11, -4,  4,   -4, -11, 4,
                -4,  -4, 11,  11, -4, 4,   4,   -11, 4,   4,  -4,  11,
                -11, 4,  -4,  -4, 11, -4,  -4,  4,   -11, 11, 4,   -4,
                4,   11, -4,  4,  4,  -11, -11, -4,  -4,  -4, -11, -4,
                -4,  -4, -11, 11, -4, -4,  4,   -11, -4,  4,  -4,  -11,
            };

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
                    current = new Contribution3(baseSet[k], { baseSet[k + 1], baseSet[k + 2], baseSet[k + 3] });

                    if (previous == nullptr) {
                        contributions3D[i / 9] = pContribution3(current);
                    } else {
                        previous->Next = current;
                    }
                    previous = current;
                }
                current->Next = new Contribution3(p3D[i + 1], { p3D[i + 2], p3D[i + 3], p3D[i + 4] });
                current->Next->Next = new Contribution3(p3D[i + 5], { p3D[i + 6], p3D[i + 7], p3D[i + 8] });
            }

            lookup3D.resize(2048);

            for (int i = 0; i < static_cast<int>(lookupPairs3D.size()); i += 2) {
                lookup3D[lookupPairs3D[i]] = contributions3D[lookupPairs3D[i + 1]].get();
            }
        }
    };
    static StaticConstructor staticConstructor;

    static iXYZ FastFloor(XYZ p) {
        // TODO: when SIMD floor operations are added, revisit this function
        iXYZ floored = {
            static_cast<int>(p.x),
            static_cast<int>(p.y),
            static_cast<int>(p.z)
        };

        floored = {
            p.x < floored.x ? floored.x - 1 : floored.x,
            p.y < floored.y ? floored.y - 1 : floored.y,
            p.z < floored.z ? floored.z - 1 : floored.z
        };

        return floored;
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
            perm3D[i] = (perm[i] % 24) * 3;
            source[r] = source[i];
        }
    }

    float Evaluate(XYZ p) {
        float stretchOffset = (p.x + p.y + p.z) * STRETCH_3D;
        XYZ s = {
            p.x + stretchOffset,
            p.y + stretchOffset,
            p.z + stretchOffset
        };

        iXYZ sb = FastFloor(s); // int part

        XYZ ins = { // frac part
            s.x - sb.x,
            s.y - sb.y,
            s.z - sb.z
        };

        float inSum = ins.x + ins.y + ins.z;
        int hash = static_cast<int>(ins.y - ins.z + 1) |
                   static_cast<int>(ins.x - ins.y + 1) << 1 |
                   static_cast<int>(ins.x - ins.z + 1) << 2 |
                   static_cast<int>(inSum) << 3 |
                   static_cast<int>(inSum + ins.z) << 5 |
                   static_cast<int>(inSum + ins.y) << 7 |
                   static_cast<int>(inSum + ins.x) << 9;

        Contribution3 *c = lookup3D[hash];

        float squishOffset = (sb.x + sb.y + sb.z) * SQUISH_3D;
        XYZ d0 = {
            p.x - (sb.x + squishOffset),
            p.y - (sb.y + squishOffset),
            p.z - (sb.z + squishOffset)
        };

        float value = 0.0;
        while (c != nullptr) {
            XYZ d = {
                d0.x + c->d.x,
                d0.y + c->d.y,
                d0.z + c->d.z
            };

            float attn = 2 - d.x * d.x - d.y * d.y - d.z * d.z;
            if (attn > 0) {
                iXYZ pa = {
                    sb.x + c->sb.x,
                    sb.y + c->sb.y,
                    sb.z + c->sb.z
                };

                int i = perm3D[(perm[(perm[pa.x & 0xFF] + pa.y) & 0xFF] + pa.z) & 0xFF];
                float valuePart = gradients3D[i] * d.x +
                                   gradients3D[i + 1] * d.y +
                                   gradients3D[i + 2] * d.z;

                attn *= attn;
                value += attn * attn * valuePart;
            }
            c = c->Next;
        }

        return value * NORM_3D;
    }
};
