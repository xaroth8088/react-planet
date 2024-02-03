// The MIT License
// Copyright © 2013 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

//// Value noise, float-based
//// https://www.shadertoy.com/view/4sfGzS
fn hash(p: vec3<f32>) -> f32 {
    let p_mod: vec3<f32> = vec3<f32>(dot(p, vec3<f32>(127.1, 311.7, 74.7)),
                                     dot(p, vec3<f32>(269.5, 183.3, 246.1)),
                                     dot(p, vec3<f32>(113.5, 271.9, 124.6)));

    return -1.0 + 2.0 * fract(sin(dot(p_mod, vec3<f32>(12.9898, 78.233, 45.164))) * 43758.5453123);
}

fn noise(x: vec3<f32>, seed: u32) -> f32 {
    let i: vec3<f32> = floor(x);
    var f: vec3<f32> = fract(x);
    f = f * f * (3.0 - 2.0 * f);

    let mix_000_100: f32 = mix(hash(i + vec3<f32>(0, 0, 0)),
                               hash(i + vec3<f32>(1, 0, 0)), f.x);
    let mix_010_110: f32 = mix(hash(i + vec3<f32>(0, 1, 0)),
                               hash(i + vec3<f32>(1, 1, 0)), f.x);
    let mix_001_101: f32 = mix(hash(i + vec3<f32>(0, 0, 1)),
                               hash(i + vec3<f32>(1, 0, 1)), f.x);
    let mix_011_111: f32 = mix(hash(i + vec3<f32>(0, 1, 1)),
                               hash(i + vec3<f32>(1, 1, 1)), f.x);

    let mix_y0: f32 = mix(mix_000_100, mix_010_110, f.y);
    let mix_y1: f32 = mix(mix_001_101, mix_011_111, f.y);

    return mix(mix_y0, mix_y1, f.z);
}
