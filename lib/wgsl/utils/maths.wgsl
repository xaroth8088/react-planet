fn sphereMap(u: f32, v: f32) -> Point3 {
    let azimuth: f32 = 2.0 * pi * u;
    let inclination: f32 = pi * v;

    return Point3(
        sin(inclination) * cos(azimuth),
        sin(inclination) * sin(azimuth),
        cos(inclination)
    );
}

fn smootherstep(t: f32) -> f32 {
    return 6.0 * (pow(t, 5.0)) - 15.0 * (pow(t, 4.0)) + 10.0 * (pow(t, 3));
}
