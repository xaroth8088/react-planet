# NEW FOR 2.0
* Demo page needs to be redone in modern way
* Changing a control causes three.js to be discarded and restarted
* Something isn't getting cleaned up properly (likely textures somehow, but who knows).  The severity of this goes down a lot if we're not resetting the component constantly.
* Is there some way to use Uniforms instead of the million parameters being passed into the main function?
* Can we use the primitive smoothstep() instead of smootherstep() and still get good results? (Once we're more confident about the texture generation and rendering)
* Needs a better seed mechanism and/or to limit the values to something a lot smaller (if we're keeping with my hacky "seed")

# Library 
* BUG IN LIBRARY: isn't freeing memory well?
* BUG IN LIBRARY: doesn't automatically redraw when props change
* Make the number of segments for the planet model configurable via props (PlanetRenderer.jsx::segments)
* Add params for planet and cloud rotation speeds
* Add params for planet and cloud rotation speeds on the x-axis

# Demo Page
* De-bounce changes in controls
