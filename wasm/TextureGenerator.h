#pragma once

#include <emscripten/bind.h>
#include <stdlib.h>
#include "NoiseWrapper.h"

using namespace emscripten;

struct RGBA{
    unsigned char r, g, b, a;
};

struct XYZ {
    double x, y, z;
};

class TextureGenerator {

	private:
		//Determines if a JS value is of the specified type
		//If a property does not exist, we will see it as undefined
        bool isType(val value, const std::string& type) {
			return (value.typeof().as<std::string>() == type);
		}

		unsigned char* diffuseBuffer;
		unsigned char* normalBuffer;
		unsigned char* specularBuffer;
		unsigned char* cloudBuffer;

		NoiseWrapper* surfaceNoise;
		NoiseWrapper* landNoise;
		NoiseWrapper* cloudNoise;

		double surfaceHeight(double x, double y, double z);
        RGBA surfaceColor(double x, double y, double z);
        RGBA UL2RGBA(unsigned long dwColor);
        XYZ sphereMap(double u, double v);
        double smootherstep(double t);
        RGBA normalRGBA(double x, double y, double z);
        void setPixel(unsigned char* buffer, unsigned int x, unsigned int y, RGBA color);
	public:
	    // TODO: move all this into private
	    double surfaceSeed = 0;
	    double landSeed = 1;
	    double cloudSeed = 2;

	    unsigned int resolution = 256;

        double surfaceiScale = 2;
        unsigned char surfaceiOctaves = 8;
        double surfaceiFalloff = 1;
        double surfaceiIntensity = 1;
        double surfaceiRidginess = 0.5;
        double surfacesScale = 1;
        unsigned char surfacesOctaves = 0;
        double surfacesFalloff = 1;
        double surfacesIntensity = 1;

        // TODO: change the inputs for colors to only take a 4-element UInt8Array,
        // TODO: and use JS (https://github.com/colorjs/color-normalize) to do the
        // TODO: conversion before calling into this library
        RGBA landColor1 = this->UL2RGBA(0xe6af7eff);
        RGBA landColor2 = this->UL2RGBA(0x007200ff);
        double landiScale = 2;
        unsigned char landiOctaves = 1;
        double landiFalloff = 1;
        double landiIntensity = 1;
        double landiRidginess = 0;
        double landsScale = 2;
        unsigned char landsOctaves = 0;
        double landsFalloff = 1;
        double landsIntensity = 1;

        RGBA waterDeep = this->UL2RGBA(0x000055ff);
        RGBA waterShallow = this->UL2RGBA(0x0000ffff);
        double waterLevel = 0.68;
        double waterSpecular = 1;
        double waterFalloff = 1;

        RGBA cloudColor = this->UL2RGBA(0xffffffff);
        double cloudOpacity = 0.75;
        double cloudiScale = 0.5;
        unsigned char cloudiOctaves = 2;
        double cloudiFalloff = 2;
        double cloudiIntensity = 1.8;
        double cloudiRidginess = 0;
        double cloudsScale = 0.5;
        unsigned char cloudsOctaves = 5;
        double cloudsFalloff = 1;
        double cloudsIntensity = 1;
        double normalScale = 0.05;

		TextureGenerator(val options);

        void GenerateTextures();
        val getDiffuseTexture();
        val getNormalTexture();
        val getSpecularTexture();
        val getCloudTexture();

};
