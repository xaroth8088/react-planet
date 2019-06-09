#include "EmscriptenWrapper.h"

int fls(int mask)
{
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

//Determines if a JS value is of the specified type
//If a property does not exist, we will see it as undefined
bool isType(val value, const std::string &type)
{
    return (value.typeof().as<std::string>() == type);
}

EmscriptenWrapper::EmscriptenWrapper(val options) {
    generator = new TextureGenerator();
    ParseOptions(options);
}

void EmscriptenWrapper::ParseOptions(val options)
{
    val opt = options["surfaceSeed"];
    if (isType(opt, "number"))
    {
        generator->surfaceSeed = opt.as<double>();
    }
    
    opt = options["landSeed"];
    if (isType(opt, "number"))
    {
        generator->landSeed = opt.as<double>();
    }
    
    opt = options["cloudSeed"];
    if (isType(opt, "number"))
    {
        generator->cloudSeed = opt.as<double>();
    }
    
    opt = options["resolution"];
    if (isType(opt, "number"))
    {
        // bump up to the nearest power of 2
        unsigned int configResolution = opt.as<unsigned int>();
        unsigned char powerOfTwo = fls(configResolution - 1);
        if (configResolution > 0)
        {
            generator->resolution = 1 << powerOfTwo;
        }
        
        // The minimum resolution is 2 (otherwise the height becomes 0 when we put the textures into the 2:1 aspect ratio)
        if (generator->resolution < 2)
        {
            generator->resolution = 2;
        }
    }
    
    // Initialize all other configuration
    opt = options["surfaceiScale"];
    if (isType(opt, "number"))
    {
        generator->surfaceiScale = opt.as<double>();
    }
    
    opt = options["surfaceiOctaves"];
    if (isType(opt, "number"))
    {
        generator->surfaceiOctaves = opt.as<unsigned char>();
    }
    
    opt = options["surfaceiFalloff"];
    if (isType(opt, "number"))
    {
        generator->surfaceiFalloff = opt.as<double>();
    }
    
    opt = options["surfaceiIntensity"];
    if (isType(opt, "number"))
    {
        generator->surfaceiIntensity = opt.as<double>();
    }
    
    opt = options["surfaceiRidginess"];
    if (isType(opt, "number"))
    {
        generator->surfaceiRidginess = opt.as<double>();
    }
    
    opt = options["surfacesScale"];
    if (isType(opt, "number"))
    {
        generator->surfacesScale = opt.as<double>();
    }
    
    opt = options["surfacesOctaves"];
    if (isType(opt, "number"))
    {
        generator->surfacesOctaves = opt.as<unsigned char>();
    }
    
    opt = options["surfacesFalloff"];
    if (isType(opt, "number"))
    {
        generator->surfacesFalloff = opt.as<double>();
    }
    
    opt = options["surfacesIntensity"];
    if (isType(opt, "number"))
    {
        generator->surfacesIntensity = opt.as<double>();
    }
    
    opt = options["landColor1"];
    if (isType(opt, "number"))
    {
        generator->landColor1 = generator->UL2RGB(opt.as<int>());
    }
    
    opt = options["landColor2"];
    if (isType(opt, "number"))
    {
        generator->landColor2 = generator->UL2RGB(opt.as<int>());
    }
    
    opt = options["landiScale"];
    if (isType(opt, "number"))
    {
        generator->landiScale = opt.as<double>();
    }
    
    opt = options["landiOctaves"];
    if (isType(opt, "number"))
    {
        generator->landiOctaves = opt.as<unsigned char>();
    }
    
    opt = options["landiFalloff"];
    if (isType(opt, "number"))
    {
        generator->landiFalloff = opt.as<double>();
    }
    
    opt = options["landiIntensity"];
    if (isType(opt, "number"))
    {
        generator->landiIntensity = opt.as<double>();
    }
    
    opt = options["landiRidginess"];
    if (isType(opt, "number"))
    {
        generator->landiRidginess = opt.as<double>();
    }
    
    opt = options["landsScale"];
    if (isType(opt, "number"))
    {
        generator->landsScale = opt.as<double>();
    }
    
    opt = options["landsOctaves"];
    if (isType(opt, "number"))
    {
        generator->landsOctaves = opt.as<unsigned char>();
    }
    
    opt = options["landsFalloff"];
    if (isType(opt, "number"))
    {
        generator->landsFalloff = opt.as<double>();
    }
    
    opt = options["landsIntensity"];
    if (isType(opt, "number"))
    {
        generator->landsIntensity = opt.as<double>();
    }
    
    opt = options["waterDeep"];
    if (isType(opt, "number"))
    {
        generator->waterDeep = generator->UL2RGB(opt.as<int>());
    }
    
    opt = options["waterShallow"];
    if (isType(opt, "number"))
    {
        generator->waterShallow = generator->UL2RGB(opt.as<int>());
    }
    
    opt = options["waterLevel"];
    if (isType(opt, "number"))
    {
        generator->waterLevel = opt.as<double>();
    }
    
    opt = options["waterSpecular"];
    if (isType(opt, "number"))
    {
        generator->waterSpecular = opt.as<double>();
    }
    
    opt = options["waterFalloff"];
    if (isType(opt, "number"))
    {
        generator->waterFalloff = opt.as<double>();
    }
    
    opt = options["cloudColor"];
    if (isType(opt, "number"))
    {
        generator->cloudColor = generator->UL2RGB(opt.as<int>());
    }
    
    opt = options["cloudOpacity"];
    if (isType(opt, "number"))
    {
        generator->cloudOpacity = opt.as<double>();
    }
    
    opt = options["cloudiScale"];
    if (isType(opt, "number"))
    {
        generator->cloudiScale = opt.as<double>();
    }
    
    opt = options["cloudiOctaves"];
    if (isType(opt, "number"))
    {
        generator->cloudiOctaves = opt.as<unsigned char>();
    }
    
    opt = options["cloudiFalloff"];
    if (isType(opt, "number"))
    {
        generator->cloudiFalloff = opt.as<double>();
    }
    
    opt = options["cloudiIntensity"];
    if (isType(opt, "number"))
    {
        generator->cloudiIntensity = opt.as<double>();
    }
    
    opt = options["cloudiRidginess"];
    if (isType(opt, "number"))
    {
        generator->cloudiRidginess = opt.as<double>();
    }
    
    opt = options["cloudsScale"];
    if (isType(opt, "number"))
    {
        generator->cloudsScale = opt.as<double>();
    }
    
    opt = options["cloudsOctaves"];
    if (isType(opt, "number"))
    {
        generator->cloudsOctaves = opt.as<unsigned char>();
    }
    
    opt = options["cloudsFalloff"];
    if (isType(opt, "number"))
    {
        generator->cloudsFalloff = opt.as<double>();
    }
    
    opt = options["cloudsIntensity"];
    if (isType(opt, "number"))
    {
        generator->cloudsIntensity = opt.as<double>();
    }
    
    /*
     val optComplete = options["complete"];
     if (isType(optComplete, "function"))
     {
     //No need to typecast, we store function callbacks as val
     //Do stuff with option value...
     }
     */
}

void EmscriptenWrapper::GenerateTextures()
{
    generator->GenerateTextures();
}

val EmscriptenWrapper::getDiffuseTexture()
{
    return val(typed_memory_view(generator->getTextureSize(false), generator->diffuseBuffer));
}

val EmscriptenWrapper::getNormalTexture()
{
    return val(typed_memory_view(generator->getTextureSize(false), generator->normalBuffer));
}

val EmscriptenWrapper::getSpecularTexture()
{
    return val(typed_memory_view(generator->getTextureSize(false), generator->specularBuffer));
}

val EmscriptenWrapper::getCloudTexture()
{
    return val(typed_memory_view(generator->getTextureSize(true), generator->cloudBuffer));
}
