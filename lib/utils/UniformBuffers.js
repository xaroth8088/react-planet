import {memoizedPermutationsFunction} from "./Math.js";

export function addUniformsToBuffer(uBuffer, uniforms) {
    uniforms.forEach(
        uniform => {
            uBuffer.addUniform(uniform[0], uniform[1]);
        }
    );
}


export function updateNoiseSettings(uBuffer, sBuffer, name, data) {
    uBuffer.updateFloat(`${name}.iScale`, data.iScale);
    uBuffer.updateInt(`${name}.iOctaves`, data.iOctaves);
    uBuffer.updateFloat(`${name}.iFalloff`, data.iFalloff);
    uBuffer.updateFloat(`${name}.iIntensity`, data.iIntensity);
    uBuffer.updateFloat(`${name}.iRidginess`, data.iRidginess);
    uBuffer.updateFloat(`${name}.sScale`, data.sScale);
    uBuffer.updateInt(`${name}.sOctaves`, data.sOctaves);
    uBuffer.updateFloat(`${name}.sFalloff`, data.sFalloff);
    uBuffer.updateFloat(`${name}.sIntensity`, data.sIntensity);

    sBuffer.update(memoizedPermutationsFunction(data.seed));
}

export function addNoiseSettingsToBuffer(uBuffer, name) {
    addUniformsToBuffer(
        uBuffer,
        [
            [`${name}.iScale`, 1],
            [`${name}.iOctaves`, 1],
            [`${name}.iFalloff`, 1],
            [`${name}.iIntensity`, 1],
            [`${name}.iRidginess`, 1],
            [`${name}.sScale`, 1],
            [`${name}.sOctaves`, 1],
            [`${name}.sFalloff`, 1],
            [`${name}.sIntensity`, 1],
            [`${name}.padding0`, 1],
            [`${name}.padding1`, 1],
            [`${name}.padding2`, 1]
        ]
    );
}
