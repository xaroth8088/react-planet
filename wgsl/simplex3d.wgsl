/*
MIT License

Copyright (c) 2013 Inigo Quilez <https://iquilezles.org/>
Copyright (c) 2013 Nikita Miropolskiy
Copyright (c) 2022 David A Roberts <https://davidar.io/>
Copyright (c) 2024 Geoffrey Benson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


// Simplex Noise (http://en.wikipedia.org/wiki/Simplex_noise), a type of gradient noise
// that uses N+1 vertices for random gradient interpolation instead of 2^N as in regular
// latice based Gradient Noise.

// Simplex Noise 3D: https://www.shadertoy.com/view/XsX3zB

/* seeded discontinuous pseudorandom uniformly distributed in [-0.5, +0.5]^3 */
fn random3(c: float3, seed: f32) -> float3 {
    var j = 4096.0 * sin(dot(c, vec3(17.0, 59.4, 15.0)) + seed);
    var r = float3(0.0, 0.0, 0.0);
    r.z = fract(512.0 * j);
    j *= 0.125;
    r.x = fract(512.0 * j);
    j *= 0.125;
    r.y = fract(512.0 * j);
    return r - 0.5;
}

/* skew constants for 3d simplex functions */
const F3 = 1.0 / 3.0;
const G3 = 1.0 / 6.0;

/* 3d simplex noise */
fn simplex3d(p: float3, seed: f32) -> float
{
    /* 1. find current tetrahedron T and it's four vertices */
    /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */
    /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/

    /* calculate s and x */
    let s = floor(p + dot(p, vec3(F3)));
    let x = p - s + dot(s, vec3(G3));

    /* calculate i1 and i2 */
    let e = step(vec3(0.0), x - x.yzx);
    let i1 = e*(1.0 - e.zxy);
    let i2 = 1.0 - e.zxy*(1.0 - e);

    /* x1, x2, x3 */
    let x1 = x - i1 + G3;
    let x2 = x - i2 + 2.0*G3;
    let x3 = x - 1.0 + 3.0*G3;

    /* 2. find four surflets and store them in d */
    var w = float4(0.);
    var d = float4(0.);

    /* calculate surflet weights */
    w.x = dot(x, x);
    w.y = dot(x1, x1);
    w.z = dot(x2, x2);
    w.w = dot(x3, x3);

    /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */
    w = max(0.6 - w, float4(0.0));

    /* calculate surflet components */
    d.x = dot(random3(s, seed), x);
    d.y = dot(random3(s + i1, seed), x1);
    d.z = dot(random3(s + i2, seed), x2);
    d.w = dot(random3(s + 1.0, seed), x3);

    /* multiply d by w^4 */
    w *= w;
    w *= w;
    d *= w;

    /* 3. return the sum of the four surflets */
    return dot(d, vec4(52.0));
}
