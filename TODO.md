# NEW FOR 2.0
* Responding to window resizing isn't working
* Include Babylon, but tree-shaken, so that we don't have to have it as a peer dependency
* Get it so that the planet always fits in the canvas, regardless of container size
* Toggle based on animate property
* Having all the params in the uniform buffer has slowed things down a lot
    * Breaking apart param updates into all the separate useEffect's didn't seem to help at all


# Library 
* Make the number of segments for the planet model configurable via props (PlanetRenderer.jsx::segments)
* Add params for planet and cloud rotation speeds
* Add params for planet and cloud rotation speeds on the other axes
* Ice caps!
* Snow lines!
* Maybe we can have the clouds be more dynamic by slowly moving the sphereMap around within the simplex noise space in a wandering loop (and regenerating the texture each time)?
* Make the number of segments in the sphere mesh configurable via a prop
* Make rotation speeds into props, including giving one speed per axis, and one set of speeds for each of (land, clouds)
* Make landSpecular configurable via prop


# Demo Page
* De-bounce changes in controls (may not be necessary after further performance optimizations)
