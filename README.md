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
* A fork of the noise generation library that only includes the bare minimum required.
* Conversion of the noise generation algorithm to OpenSimplex
* Move texture generation into a web worker, so that it doesn't block the main thread

# Credits
Based on the wonderful work of [wwwtyro](https://github.com/wwwtyro/procedural.js).
Uses WebAssembly for noise generation, courtesy of [Markyparky56](https://github.com/Markyparky56/WasmNoise).
