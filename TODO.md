# NEW FOR 2.0
* Responding to window resizing isn't working
* Include Babylon, but tree-shaken, so that we don't have to have it as a peer dependency
* Break apart param updates into all the separate useEffect's, since it's expensive to do them all at the same time
* Get it so that the planet always fits in the canvas, regardless of container size
* Toggle based on animate property


# Library 
* Make the number of segments for the planet model configurable via props (PlanetRenderer.jsx::segments)
* Add params for planet and cloud rotation speeds
* Add params for planet and cloud rotation speeds on the other axes
* Ice caps!
* Maybe we can have the clouds be more dynamic by slowly moving the sphereMap around within the simplex noise space in a wandering loop (and regenerating the texture each time)?
* Make the number of segments in the sphere mesh configurable via a prop
* Make rotation speeds into props, including giving one speed per axis, and one set of speeds for each of (land, clouds)


# Demo Page
* De-bounce changes in controls (may not be necessary after further performance optimizations)
