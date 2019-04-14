#include <emscripten.h>
#include <emscripten/val.h>
#include <emscripten/bind.h>
#include <string>
#include <strings.h>
#include "TextureGenerator.h"

using namespace emscripten;

int fls(int mask) {
    /*
        https://github.com/udp/freebsd-libc/blob/master/string/fls.c
    */
	int bit;

	if (mask == 0)
		return (0);
	for (bit = 1; mask != 1; bit++)
		mask = (unsigned int)mask >> 1;

	return (bit);
}

TextureGenerator::TextureGenerator(val options) {
    val opt = options["resolution"];
    if (this->isType(opt, "number")) {
        this->resolution = 1 << fls(opt.as<unsigned short int>());
    }

    opt = options["spin"];
    if (this->isType(opt, "number")) {
        this->spin = opt.as<double>();
    }

    opt = options["surfaceiScale"];
    if (this->isType(opt, "number")) {
        this->surfaceiScale = opt.as<double>();
    }

    opt = options["surfaceiOctaves"];
    if (this->isType(opt, "number")) {
        this->surfaceiOctaves = opt.as<unsigned char>();
    }

    opt = options["surfaceiFalloff"];
    if (this->isType(opt, "number")) {
        this->surfaceiFalloff = opt.as<double>();
    }

    opt = options["surfaceiIntensity"];
    if (this->isType(opt, "number")) {
        this->surfaceiIntensity = opt.as<double>();
    }

    opt = options["surfaceiRidginess"];
    if (this->isType(opt, "number")) {
        this->surfaceiRidginess = opt.as<double>();
    }

    opt = options["surfacesScale"];
    if (this->isType(opt, "number")) {
        this->surfacesScale = opt.as<double>();
    }

    opt = options["surfacesOctaves"];
    if (this->isType(opt, "number")) {
        this->surfacesOctaves = opt.as<unsigned char>();
    }

    opt = options["surfacesFalloff"];
    if (this->isType(opt, "number")) {
        this->surfacesFalloff = opt.as<double>();
    }

    opt = options["surfacesIntensity"];
    if (this->isType(opt, "number")) {
        this->surfacesIntensity = opt.as<double>();
    }

    opt = options["landColor1"];
    if (this->isType(opt, "number")) {
        this->landColor1 = opt.as<std::string>();
    }

    opt = options["landColor2"];
    if (this->isType(opt, "string")) {
        this->landColor2 = opt.as<std::string>();
    }

    opt = options["landiScale"];
    if (this->isType(opt, "number")) {
        this->landiScale = opt.as<double>();
    }

    opt = options["landiOctaves"];
    if (this->isType(opt, "number")) {
        this->landiOctaves = opt.as<unsigned char>();
    }

    opt = options["landiFalloff"];
    if (this->isType(opt, "number")) {
        this->landiFalloff = opt.as<double>();
    }

    opt = options["landiIntensity"];
    if (this->isType(opt, "number")) {
        this->landiIntensity = opt.as<double>();
    }

    opt = options["landiRidginess"];
    if (this->isType(opt, "number")) {
        this->landiRidginess = opt.as<double>();
    }

    opt = options["landsScale"];
    if (this->isType(opt, "number")) {
        this->landsScale = opt.as<double>();
    }

    opt = options["landsOctaves"];
    if (this->isType(opt, "number")) {
        this->landsOctaves = opt.as<unsigned char>();
    }

    opt = options["landsFalloff"];
    if (this->isType(opt, "number")) {
        this->landsFalloff = opt.as<double>();
    }

    opt = options["landsIntensity"];
    if (this->isType(opt, "number")) {
        this->landsIntensity = opt.as<double>();
    }

    opt = options["waterDeep"];
    if (this->isType(opt, "string")) {
        this->waterDeep = opt.as<std::string>();
    }

    opt = options["waterShallow"];
    if (this->isType(opt, "string")) {
        this->waterShallow = opt.as<std::string>();
    }

    opt = options["waterLevel"];
    if (this->isType(opt, "number")) {
        this->waterLevel = opt.as<double>();
    }

    opt = options["waterSpecular"];
    if (this->isType(opt, "number")) {
        this->waterSpecular = opt.as<double>();
    }

    opt = options["waterFalloff"];
    if (this->isType(opt, "number")) {
        this->waterFalloff = opt.as<double>();
    }

    opt = options["cloudColor"];
    if (this->isType(opt, "string")) {
        this->cloudColor = opt.as<std::string>();
    }

    opt = options["cloudOpacity"];
    if (this->isType(opt, "number")) {
        this->cloudOpacity = opt.as<double>();
    }

    opt = options["cloudiScale"];
    if (this->isType(opt, "number")) {
        this->cloudiScale = opt.as<double>();
    }

    opt = options["cloudiOctaves"];
    if (this->isType(opt, "number")) {
        this->cloudiOctaves = opt.as<unsigned char>();
    }

    opt = options["cloudiFalloff"];
    if (this->isType(opt, "number")) {
        this->cloudiFalloff = opt.as<double>();
    }

    opt = options["cloudiIntensity"];
    if (this->isType(opt, "number")) {
        this->cloudiIntensity = opt.as<double>();
    }

    opt = options["cloudiRidginess"];
    if (this->isType(opt, "number")) {
        this->cloudiRidginess = opt.as<double>();
    }

    opt = options["cloudsScale"];
    if (this->isType(opt, "number")) {
        this->cloudsScale = opt.as<double>();
    }

    opt = options["cloudsOctaves"];
    if (this->isType(opt, "number")) {
        this->cloudsOctaves = opt.as<unsigned char>();
    }

    opt = options["cloudsFalloff"];
    if (this->isType(opt, "number")) {
        this->cloudsFalloff = opt.as<double>();
    }

    opt = options["cloudsIntensity"];
    if (this->isType(opt, "number")) {
        this->cloudsIntensity = opt.as<double>();
    }

    opt = options["normalScale"];
    if (this->isType(opt, "number")) {
        this->normalScale = opt.as<double>();
    }


/*
    val optComplete = options["complete"];
    if (this->isType(optComplete, "function"))
    {
        //No need to typecast, we store function callbacks as val
        //Do stuff with option value...
    }
    */
}