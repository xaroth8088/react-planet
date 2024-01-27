/*
Copyright (C) 2011 by Ashima Arts (Simplex noise)
Copyright (C) 2011-2016 by Stefan Gustavson (Classic noise and others)
Copyright (C) 2024 by Geoffrey Benson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
fn simplex3d(point0: vec3f, seed: f32) -> f32 {
    let C = vec2(1.0/6.0, 1.0/3.0) ;
    let D = vec4(0.0, 0.5, 1.0, 2.0);

    let v = point0 + seed;

    // First corner
    var i  = floor(v + dot(v, C.yyy) );
    let x0 =   v - i + dot(i, C.xxx) ;

    // Other corners
    let g = step(x0.yzx, x0.xyz);
    let l = 1.0 - g;
    let i1 = min( g.xyz, l.zxy );
    let i2 = max( g.xyz, l.zxy );

    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    let x1 = x0 - i1 + C.xxx;
    let x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    let x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

    // Permutations
    i = mod289_3(i);
    let p = permute4( permute4( permute4(
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    let n_ = 0.142857142857; // 1.0/7.0
    let  ns = n_ * D.wyz - D.xzx;

    let j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

    let x_ = floor(j * ns.z);
    let y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    let x = x_ *ns.x + ns.yyyy;
    let y = y_ *ns.x + ns.yyyy;
    let h = 1.0 - abs(x) - abs(y);

    let b0 = vec4( x.xy, y.xy );
    let b1 = vec4( x.zw, y.zw );

    //let s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
    //let s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    let s0 = floor(b0)*2.0 + 1.0;
    let s1 = floor(b1)*2.0 + 1.0;
    let sh = -step(h, vec4(0.0));

    let a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    let a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    var p0 = vec3(a0.xy,h.x);
    var p1 = vec3(a0.zw,h.y);
    var p2 = vec3(a1.xy,h.z);
    var p3 = vec3(a1.zw,h.w);

    //Normalise gradients
    let norm = taylorInvSqrt4(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    var m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), vec4(0.0));
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}

fn mod289_3(x: vec3f) -> vec3f { return x - floor(x * (1. / 289.)) * 289.; }
fn mod289_4(x: vec4f) -> vec4f { return x - floor(x * (1. / 289.)) * 289.; }

fn permute4(x: vec4f) -> vec4f { return mod289_4(((x * 34.0) + 1.0) * x); }

fn taylorInvSqrt4(r: vec4f) -> vec4f { return 1.79284291400159 - 0.85373472095314 * r; }
