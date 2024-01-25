# Library 
* BUG IN LIBRARY: isn't freeing memory well?
* BUG IN LIBRARY: doesn't automatically redraw when props change
* Can we move opacity of clouds into the renderer instead of requiring a new texture be generated when this changes?
* Callback for when texture generation is complete; this permits us to wrap it all in a promise over in JS-land
  * This will open an edge case where the same instance of the library's class is asked to generate textures more than once at the same time, which will likely cause problems
* Make the number of segments for the planet model configurable via props (PlanetRenderer.jsx::segments)
* Make some options in PlanetRenderer.renderer initialization into props
* Be smarter about incoming prop changes, and only regenerate the textures that would change (instead of all 3 every time)
* Generating the textures can be time-consuming, so explore options to avoid locking the UI (promise + wireframe placeholder?  Progressive texture rendering?)
* Add params for planet and cloud rotation speeds
* Add params for planet and cloud rotation speeds on the x-axis
* Resilience for failure of the wasm module to load (in Application.jsx::loadModule())

# Demo Page
* De-bounce changes in controls
