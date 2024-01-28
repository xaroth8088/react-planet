# NEW FOR 2.0
* Something isn't getting cleaned up properly (likely textures somehow, but who knows).  The severity of this goes down a lot if we're not resetting the component constantly.
* Is there some way to use Uniforms instead of the million parameters being passed into the main function?
* Can we use the primitive smoothstep() instead of smootherstep() and still get good results? (Once we're more confident about the texture generation and rendering)
* Finish work on sending simplex permutations tables to the shader
* Finish work on re-running the shader whenever the props change

# Library 
* BUG IN LIBRARY: isn't freeing memory well?
* BUG IN LIBRARY: doesn't automatically redraw when props change
* Make the number of segments for the planet model configurable via props (PlanetRenderer.jsx::segments)
* Add params for planet and cloud rotation speeds
* Add params for planet and cloud rotation speeds on the x-axis

# Demo Page
* De-bounce changes in controls
