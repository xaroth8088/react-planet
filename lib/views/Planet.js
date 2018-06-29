import PropTypes from 'prop-types';
import React from 'react';
import Application from '../Application';

// TODO: a prop to say "don't animate this - I just want a static image", which then bypasses the THREE rendering (like the 'sprite' render does in the original)
// TODO: fall back to the 'static image' behavior whenever WebGL fails to initialize

class Planet extends React.Component {
    static propTypes = {
        resolution: PropTypes.number, // TODO: This _MUST_ be a power of 2, so automatically enforce that
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
    };

    static defaultProps = {
        resolution: 256,
        spin: 1,

        surfaceiScale: 2,
        surfaceiOctaves: 8,
        surfaceiFalloff: 1,
        surfaceiIntensity: 1,
        surfaceiRidginess: 0.5,
        surfacesScale: 1,
        surfacesOctaves: 0,
        surfacesFalloff: 1,
        surfacesIntensity: 1,

        landColor1: '#e6af7e',
        landColor2: '#007200',
        landiScale: 2,
        landiOctaves: 1,
        landiFalloff: 1,
        landiIntensity: 1,
        landiRidginess: 0,
        landsScale: 2,
        landsOctaves: 0,
        landsFalloff: 1,
        landsIntensity: 1,

        waterDeep: '#000055',
        waterShallow: '#0000ff',
        waterLevel: 0.68,
        waterSpecular: 1,
        waterFalloff: 1,

        cloudColor: '#ffffff',
        cloudOpacity: 1,
        cloudiScale: 0.5,
        cloudiOctaves: 2,
        cloudiFalloff: 2,
        cloudiIntensity: 1.8,
        cloudiRidginess: 0,
        cloudsScale: 0.5,
        cloudsOctaves: 5,
        cloudsFalloff: 1,
        cloudsIntensity: 1,
        normalScale: 0.05,
        animate: true,
    };

    constructor(...args) {
        super(...args);
        this.planetRef = React.createRef();
        this.app = null;
    }

    componentDidMount() {
        this.app = new Application(this.planetRef.current, this.props);
        this.app.update();
    }

    render() {
        return (
            <div ref={this.planetRef} {...this.props} />
        );
    }
}

export default Planet;
