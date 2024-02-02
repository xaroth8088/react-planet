# NEW FOR 2.0
* Responding to window resizing isn't working
* Get it so that the planet always fits in the canvas, regardless of container size
* Toggle based on animate property
* When resolution changes, make changes to textures without needing to restart Babylon
* Demo page + GitHub pages deployment
* 2k texture hangs the GPU, due to generation taking too long


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
