import Planet from '@xaroth8088/react-planet';
import { uniqueId } from 'lodash';
import React, { useState } from 'react';
import './App.css';
import Controls from './Controls';

function App() {
    const [resolution, setResolution] = useState(512);
    const [animate, setAnimate] = useState(true);

    const [surfaceSeed, setSurfaceSeed] = useState(Math.random() * Number.MAX_SAFE_INTEGER);
    const [surfaceiScale, setSurfaceiScale] = useState(2);
    const [surfaceiOctaves, setSurfaceiOctaves] = useState(8);
    const [surfaceiFalloff, setSurfaceiFalloff] = useState(1);
    const [surfaceiIntensity, setSurfaceiIntensity] = useState(1);
    const [surfaceiRidginess, setSurfaceiRidginess] = useState(0.5);
    const [surfacesScale, setSurfacesScale] = useState(1);
    const [surfacesOctaves, setSurfacesOctaves] = useState(0);
    const [surfacesFalloff, setSurfacesFalloff] = useState(1);
    const [surfacesIntensity, setSurfacesIntensity] = useState(1);

    const [landColor1, setLandColor1] = useState('#e6af7e');
    const [landColor2, setLandColor2] = useState('#007200');
    const [landSeed, setLandSeed] = useState(Math.random() * Number.MAX_SAFE_INTEGER);
    const [landiScale, setLandiScale] = useState(2);
    const [landiOctaves, setLandiOctaves] = useState(8);
    const [landiFalloff, setLandiFalloff] = useState(1);
    const [landiIntensity, setLandiIntensity] = useState(1);
    const [landiRidginess, setLandiRidginess] = useState(0.5);
    const [landsScale, setLandsScale] = useState(1);
    const [landsOctaves, setLandsOctaves] = useState(0);
    const [landsFalloff, setLandsFalloff] = useState(1);
    const [landsIntensity, setLandsIntensity] = useState(1);

    const [waterDeep, setWaterDeep] = useState('#000033');
    const [waterShallow, setWaterShallow] = useState('#0000ff');
    const [waterLevel, setWaterLevel] = useState(0.68);
    const [waterSpecular, setWaterSpecular] = useState(1);
    const [waterFalloff, setWaterFalloff] = useState(1);

    return (
        <div className="App">
            <Planet
                key={uniqueId()}

                className="planet"
                resolution={resolution}
                animate={animate}

                surfaceSeed={surfaceSeed}
                surfaceiScale={surfaceiScale}
                surfaceiOctaves={surfaceiOctaves}
                surfaceiFalloff={surfaceiFalloff}
                surfaceiIntensity={surfaceiIntensity}
                surfaceiRidginess={surfaceiRidginess}
                surfacesScale={surfacesScale}
                surfacesOctaves={surfacesOctaves}
                surfacesFalloff={surfacesFalloff}
                surfacesIntensity={surfacesIntensity}

                landColor1={landColor1}
                landColor2={landColor2}
                landSeed={landSeed}
                landiScale={landiScale}
                landiOctaves={landiOctaves}
                landiFalloff={landiFalloff}
                landiIntensity={landiIntensity}
                landiRidginess={landiRidginess}
                landsScale={landsScale}
                landsOctaves={landsOctaves}
                landsFalloff={landsFalloff}
                landsIntensity={landsIntensity}

                waterDeep={waterDeep}
                waterShallow={waterShallow}
                waterLevel={waterLevel}
                waterSpecular={waterSpecular}
                waterFalloff={waterFalloff}
            />
            <div className="controls-container">
                <Controls
                    resolution={resolution}
                    setResolution={setResolution}
                    animate={animate}
                    setAnimate={setAnimate}

                    surfaceSeed={surfaceSeed}
                    setSurfaceSeed={setSurfaceSeed}
                    surfaceiScale={surfaceiScale}
                    setSurfaceiScale={setSurfaceiScale}
                    surfaceiOctaves={surfaceiOctaves}
                    setSurfaceiOctaves={setSurfaceiOctaves}
                    surfaceiFalloff={surfaceiFalloff}
                    setSurfaceiFalloff={setSurfaceiFalloff}
                    surfaceiIntensity={surfaceiIntensity}
                    setSurfaceiIntensity={setSurfaceiIntensity}
                    surfaceiRidginess={surfaceiRidginess}
                    setSurfaceiRidginess={setSurfaceiRidginess}
                    surfacesScale={surfacesScale}
                    setSurfacesScale={setSurfacesScale}
                    surfacesOctaves={surfacesOctaves}
                    setSurfacesOctaves={setSurfacesOctaves}
                    surfacesFalloff={surfacesFalloff}
                    setSurfacesFalloff={setSurfacesFalloff}
                    surfacesIntensity={surfacesIntensity}
                    setSurfacesIntensity={setSurfacesIntensity}

                    landColor1={landColor1}
                    setLandColor1={setLandColor1}
                    landColor2={landColor2}
                    setLandColor2={setLandColor2}
                    landSeed={landSeed}
                    setLandSeed={setLandSeed}
                    landiScale={landiScale}
                    setLandiScale={setLandiScale}
                    landiOctaves={landiOctaves}
                    setLandiOctaves={setLandiOctaves}
                    landiFalloff={landiFalloff}
                    setLandiFalloff={setLandiFalloff}
                    landiIntensity={landiIntensity}
                    setLandiIntensity={setLandiIntensity}
                    landiRidginess={landiRidginess}
                    setLandiRidginess={setLandiRidginess}
                    landsScale={landsScale}
                    setLandsScale={setLandsScale}
                    landsOctaves={landsOctaves}
                    setLandsOctaves={setLandsOctaves}
                    landsFalloff={landsFalloff}
                    setLandsFalloff={setLandsFalloff}
                    landsIntensity={landsIntensity}
                    setLandsIntensity={setLandsIntensity}

                    waterDeep={waterDeep}
                    setWaterDeep={setWaterDeep}
                    waterShallow={waterShallow}
                    setWaterShallow={setWaterShallow}
                    waterLevel={waterLevel}
                    setWaterLevel={setWaterLevel}
                    waterSpecular={waterSpecular}
                    setWaterSpecular={setWaterSpecular}
                    waterFalloff={waterFalloff}
                    setWaterFalloff={setWaterFalloff}

                />
            </div>
        </div>
    );
}

export default App;
