fn sphereMap(u: f32, v: f32) -> Point3 {
    let azimuth: f32 = 2.0 * pi * u;
    let inclination: f32 = pi * v;

    return Point3(
        sin(inclination) * cos(azimuth),
        sin(inclination) * sin(azimuth),
        cos(inclination)
    );
}
