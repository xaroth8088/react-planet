import * as PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import Application from '../Application';

// TODO: a prop to say "don't animate this - I just want a static image", which then bypasses the THREE rendering (like the 'sprite' render does in the original)
// TODO: fall back to the 'static image' behavior whenever WebGL fails to initialize

function Planet(props) {
    let app;

    const canvasRef = useCallback(async (node) => {
        if (node !== null) {
            // Filter out null props
            const newProps = Object.keys(props)
                .filter(key => props[key] !== null)
                .reduce(
                    (res, key) => {
                        res[key] = props[key];
                        return res;
                    }, {}
                );

            // Randomize any non-supplied seeds
            const { surfaceSeed, landSeed, cloudSeed } = props;

            if (surfaceSeed === null) {
                newProps.surfaceSeed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
            }

            if (landSeed === null) {
                newProps.landSeed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
            }

            if (cloudSeed === null) {
                newProps.cloudSeed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
            }

            // Start up the application
            app = new Application(node, newProps);
            await app.init();
            app.update();
        } else {
            app = null;
        }
    }, []);

    // Any props that the library doesn't care about should be passed on to the containing div
    const divProps = {};
    Object.keys(props).forEach(
        (key) => {
            if (!(key in Planet.defaultProps)) {
                divProps[key] = props[key];
            }
        }
    );

    return (
        <div ref={canvasRef} {...divProps} />
    );
}

// The properties required by the WebAssembly texture generator
const wasmProperties = {
    resolution: null,

    surfaceSeed: null,
    surfaceiScale: null,
    surfaceiOctaves: null,
    surfaceiFalloff: null,
    surfaceiIntensity: null,
    surfaceiRidginess: null,
    surfacesScale: null,
    surfacesOctaves: null,
    surfacesFalloff: null,
    surfacesIntensity: null,

    landSeed: null,
    landColor1: null,
    landColor2: null,
    landiScale: null,
    landiOctaves: null,
    landiFalloff: null,
    landiIntensity: null,
    landiRidginess: null,
    landsScale: null,
    landsOctaves: null,
    landsFalloff: null,
    landsIntensity: null,

    waterDeep: null,
    waterShallow: null,
    waterLevel: null,
    waterSpecular: null,
    waterFalloff: null,

    cloudSeed: null,
    cloudColor: null,
    cloudOpacity: null,
    cloudiScale: null,
    cloudiOctaves: null,
    cloudiFalloff: null,
    cloudiIntensity: null,
    cloudiRidginess: null,
    cloudsScale: null,
    cloudsOctaves: null,
    cloudsFalloff: null,
    cloudsIntensity: null
};

Planet.defaultProps = {
    normalScale: 0.05,
    animate: true,
    ...wasmProperties
};

Planet.propTypes = {
    resolution: PropTypes.number,

    surfaceSeed: PropTypes.number,
    surfaceiScale: PropTypes.number,
    surfaceiOctaves: PropTypes.number,
    surfaceiFalloff: PropTypes.number,
    surfaceiIntensity: PropTypes.number,
    surfaceiRidginess: PropTypes.number,
    surfacesScale: PropTypes.number,
    surfacesOctaves: PropTypes.number,
    surfacesFalloff: PropTypes.number,
    surfacesIntensity: PropTypes.number,

    landSeed: PropTypes.number,
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

    cloudSeed: PropTypes.number,
    cloudColor: PropTypes.string,
    cloudOpacity: PropTypes.number,
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
    animate: PropTypes.bool
};

export default Planet;
