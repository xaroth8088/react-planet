#pragma once

#include <emscripten/bind.h>

using namespace emscripten;

class TextureGenerator {

	private:
		//Determines if a JS value is of the specified type
		//If a property does not exist, we will see it as undefined
        bool isType(val value, const std::string& type) {
			return (value.typeof().as<std::string>() == type);
		}

	public:
	    unsigned short int resolution = 256;
	    double spin = 1;

        double surfaceiScale = 2;
        unsigned char surfaceiOctaves = 8;
        double surfaceiFalloff = 1;
        double surfaceiIntensity = 1;
        double surfaceiRidginess = 0.5;
        double surfacesScale = 1;
        unsigned char surfacesOctaves = 0;
        double surfacesFalloff = 1;
        double surfacesIntensity = 1;

        std::string landColor1 = "#e6af7e";
        std::string landColor2 = "#007200";
        double landiScale = 2;
        unsigned char landiOctaves = 1;
        double landiFalloff = 1;
        double landiIntensity = 1;
        double landiRidginess = 0;
        double landsScale = 2;
        unsigned char landsOctaves = 0;
        double landsFalloff = 1;
        double landsIntensity = 1;

        std::string waterDeep = "#000055";
        std::string waterShallow = "#0000ff";
        double waterLevel = 0.68;
        double waterSpecular = 1;
        double waterFalloff = 1;

        std::string cloudColor = "#ffffff";
        double cloudOpacity = 1;
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
};
