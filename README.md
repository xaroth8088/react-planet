# react-planet
Procedurally generated planets in a React component.

# Usage
```jsx
import Planet from '@xaroth8088/react-planet';

<Planet />
```

# PropTypes
```
        resolution: PropTypes.number, // This _MUST_ be a power of 2
        spin: PropTypes.number,

        surfaceiScale: PropTypes.number,
        surfaceiOctaves: PropTypes.number,
        surfaceiFalloff: PropTypes.number,
        surfaceiIntensity: PropTypes.number,
        surfaceiRidginess: PropTypes.number,
        surfacesScale: PropTypes.number,
        surfacesOctaves: PropTypes.number,
        surfacesFalloff: PropTypes.number,
        surfacesIntensity: PropTypes.number,

        landColor1: PropTypes.string,
        landColor2: PropTypes.string,
        landiScale: PropTypes.number,
        landiOctaves: PropTypes.number,
        landiFalloff: PropTypes.number,
        landiIntensity: PropTypes.number,
        landiRidginess: PropTypes.number,
        landsScale: PropTypes.number,
        landsOctaves: PropTypes.number,
        landsFalloff: PropTypes.number,
        landsIntensity: PropTypes.number,

        waterDeep: PropTypes.string,
        waterShallow: PropTypes.string,
        waterLevel: PropTypes.number,
        waterSpecular: PropTypes.number,
        waterFalloff: PropTypes.number,

        cloudColor: PropTypes.string,
        cloudOpacity: PropTypes.string,
        cloudiScale: PropTypes.number,
        cloudiOctaves: PropTypes.number,
        cloudiFalloff: PropTypes.number,
        cloudiIntensity: PropTypes.number,
        cloudiRidginess: PropTypes.number,
        cloudsScale: PropTypes.number,
        cloudsOctaves: PropTypes.number,
        cloudsFalloff: PropTypes.number,
        cloudsIntensity: PropTypes.number,
        normalScale: PropTypes.number,
        animate: PropTypes.number,
 ```

# Contribution
Pull requests are welcome!

Not sure where to start contributing? Here's a few areas that would be helpful:
* Documentation for the various properties
* A small demo app to put onto github.io that lets people tinker with the parameters in realtime
* Moving the texture generation entirely into WebAssembly, to reduce the back-and-forth to the noise generation library
* Move texture generation into a web worker, so that it doesn't block the main thread
* Most textures don't require the alpha channel; convert those to use `THREE.RGBFormat` (which will reduce the size of the textures)
* Move emscripten to happen via a Docker container, instead of assuming it's in a sibling directory
* Find and complete TODO's in the code

# Developing
```
$ yarn build:wasm   // Assumes you've got emsdk in a sibling directory to this package's source
$ yarn build:watch  // Development build, with file watching
$ yarn build        // Production build
```

# Credits
Based on the wonderful work of [wwwtyro](https://github.com/wwwtyro/procedural.js).

C port of OpenSimplex courtesy of [deerel](https://github.com/deerel/OpenSimplexNoise).
