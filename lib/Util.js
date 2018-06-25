export function rgba(r, g, b, a) {
    const newR = Math.floor(r * 255);
    const newG = Math.floor(g * 255);
    const newB = Math.floor(b * 255);
    return `rgba(${newR},${newG},${newB},${a})`;
}

export function randomRGB() {
    return `#${Math.round(Math.random() * 0xffffff).toString(16)}`;
}

export function normalRGBA(x, y, z) {
    return {
        r: x / 2 + 0.5,
        g: y / 2 + 0.5,
        b: z / 2 + 0.5
    };
}

export function smootherstep(t) {
    return 6 * (t ** 5) - 15 * (t ** 4) + 10 * (t ** 3);
}

export function sphereMap(u, v) {
    /*  Returns the 3D cartesian coordinate of a point on
        a sphere that corresponds to the given u,v coordinate. */
    const azimuth = 2 * Math.PI * u;
    const inclination = Math.PI * v;
    const x = Math.sin(inclination) * Math.cos(azimuth);
    const y = Math.sin(inclination) * Math.sin(azimuth);
    const z = Math.cos(inclination);
    return {
        x,
        y,
        z
    };
}

export function datColor(color) {
    const s = color.replace('#', '');
    return {
        r: parseInt(s.slice(0, 2), 16) / 255,
        g: parseInt(s.slice(2, 4), 16) / 255,
        b: parseInt(s.slice(4, 6), 16) / 255
    };
}

export function randomSeed() {
    return btoa(Math.floor(Math.random() * 9999999999999)).replace('=', '').replace('=', '');
}