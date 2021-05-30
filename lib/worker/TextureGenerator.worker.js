/* eslint-disable no-restricted-globals */
import GenerateTexture from '../wasm/GenerateTexture.mjs';

onmessage = async ({ data: config }) => {
    const generateTextureModule = GenerateTexture();

    // Create the texture generation object
    const textureGenerator = new generateTextureModule.TextureGenerator({
        ...config
    });

    // TODO: in lieu of "real" threads, spawn new workers to gather _parts_
    //  of the final texture in parallel.  (e.g. only calculate every nth pixel, then combine)

    // The expensive part
    textureGenerator.GenerateTextures();

    // Pull out the texture data
    const diffusePixels = textureGenerator.getDiffuseTexture();
    const normalPixels = textureGenerator.getNormalTexture();
    const specularPixels = textureGenerator.getSpecularTexture();
    const cloudPixels = textureGenerator.getCloudTexture();

    // TODO: is there a way for the wasm to directly write into shared buffers, instead of needing to copy it here?
    const diffuseSAB = new Uint8Array(new SharedArrayBuffer(diffusePixels.byteLength));
    diffuseSAB.set(diffusePixels);
    const normalSAB = new Uint8Array(new SharedArrayBuffer(normalPixels.byteLength));
    normalSAB.set(normalPixels);
    const specularSAB = new Uint8Array(new SharedArrayBuffer(specularPixels.byteLength));
    specularSAB.set(specularPixels);
    const cloudSAB = new Uint8Array(new SharedArrayBuffer(cloudPixels.byteLength));
    cloudSAB.set(cloudPixels);

    postMessage({
        diffuseSAB,
        normalSAB,
        specularSAB,
        cloudSAB
    });
};
