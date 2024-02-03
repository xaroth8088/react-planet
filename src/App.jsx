import Planet from '../lib/main.js';
import { useState } from 'react'
import './App.css'
import Controls from './Controls.jsx';

function App() {
    const [normalScale, setNormalScale] = useState(0.33);
    const [resolution, setResolution] = useState(256);
    const [animate, setAnimate] = useState(true);

    const [surfaceSeed, setSurfaceSeed] = useState(parseInt(Math.random() * Number.MAX_SAFE_INTEGER));
    const [surfaceiScale, setSurfaceiScale] = useState(1);
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
    const [landSeed, setLandSeed] = useState(parseInt(Math.random() * Number.MAX_SAFE_INTEGER));
    const [landiScale, setLandiScale] = useState(2);
    const [landiOctaves, setLandiOctaves] = useState(1);
    const [landiFalloff, setLandiFalloff] = useState(1);
    const [landiIntensity, setLandiIntensity] = useState(1);
    const [landiRidginess, setLandiRidginess] = useState(0);
    const [landsScale, setLandsScale] = useState(2);
    const [landsOctaves, setLandsOctaves] = useState(0);
    const [landsFalloff, setLandsFalloff] = useState(1);
    const [landsIntensity, setLandsIntensity] = useState(1);

    const [waterDeep, setWaterDeep] = useState('#000033');
    const [waterShallow, setWaterShallow] = useState('#0000ff');
    const [waterLevel, setWaterLevel] = useState(0.68);
    const [waterSpecular, setWaterSpecular] = useState(0.75);
    const [waterFalloff, setWaterFalloff] = useState(1);

    const [cloudSeed, setCloudSeed] = useState(parseInt(Math.random() * Number.MAX_SAFE_INTEGER));
    const [cloudColor, setCloudColor] = useState('#ffffff');
    const [cloudOpacity, setCloudOpacity] = useState(0.75);
    const [cloudiScale, setCloudiScale] = useState(0.4);
    const [cloudiOctaves, setCloudiOctaves] = useState(9);
    const [cloudiFalloff, setCloudiFalloff] = useState(2.2);
    const [cloudiIntensity, setCloudiIntensity] = useState(1.6);
    const [cloudiRidginess, setCloudiRidginess] = useState(0.2);
    const [cloudsScale, setCloudsScale] = useState(0.7);
    const [cloudsOctaves, setCloudsOctaves] = useState(5);
    const [cloudsFalloff, setCloudsFalloff] = useState(0.8);
    const [cloudsIntensity, setCloudsIntensity] = useState(1);

    return (
        <div className="App">
            <Planet
                className="planet"
                normalScale={normalScale}
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
                landSeed={landSeed}
                landColor1={landColor1}
                landColor2={landColor2}
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
                cloudSeed={cloudSeed}
                cloudColor={cloudColor}
                cloudOpacity={cloudOpacity}
                cloudiScale={cloudiScale}
                cloudiOctaves={cloudiOctaves}
                cloudiFalloff={cloudiFalloff}
                cloudiIntensity={cloudiIntensity}
                cloudiRidginess={cloudiRidginess}
                cloudsScale={cloudsScale}
                cloudsOctaves={cloudsOctaves}
                cloudsFalloff={cloudsFalloff}
                cloudsIntensity={cloudsIntensity}
            />
            <div className="controls-container">
                <Controls
                    normalScale={normalScale}
                    setNormalScale={setNormalScale}
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
                    landSeed={landSeed}
                    setLandSeed={setLandSeed}
                    landColor1={landColor1}
                    setLandColor1={setLandColor1}
                    landColor2={landColor2}
                    setLandColor2={setLandColor2}
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
                    cloudSeed={cloudSeed}
                    setCloudSeed={setCloudSeed}
                    cloudColor={cloudColor}
                    setCloudColor={setCloudColor}
                    cloudOpacity={cloudOpacity}
                    setCloudOpacity={setCloudOpacity}
                    cloudiScale={cloudiScale}
                    setCloudiScale={setCloudiScale}
                    cloudiOctaves={cloudiOctaves}
                    setCloudiOctaves={setCloudiOctaves}
                    cloudiFalloff={cloudiFalloff}
                    setCloudiFalloff={setCloudiFalloff}
                    cloudiIntensity={cloudiIntensity}
                    setCloudiIntensity={setCloudiIntensity}
                    cloudiRidginess={cloudiRidginess}
                    setCloudiRidginess={setCloudiRidginess}
                    cloudsScale={cloudsScale}
                    setCloudsScale={setCloudsScale}
                    cloudsOctaves={cloudsOctaves}
                    setCloudsOctaves={setCloudsOctaves}
                    cloudsFalloff={cloudsFalloff}
                    setCloudsFalloff={setCloudsFalloff}
                    cloudsIntensity={cloudsIntensity}
                    setCloudsIntensity={setCloudsIntensity}
                />
            </div>
        </div>
    );
}

export default App;
