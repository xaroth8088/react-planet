//
//  main.cpp
//  react-planet
//
//  Created by Geoffrey Benson on 6/5/19.
//  Copyright © 2019 Geoffrey Benson. All rights reserved.
//
// This XCode project exists solely to make development of the C++ portions of the project easier.

#include <iostream>
#include "wasm/TextureGenerator/TextureGenerator.h"

int main(int argc, const char * argv[]) {
    TextureGenerator* test = new TextureGenerator();
    test->GenerateTextures();

    std::cout << test->getCloudTexture() << "\n";

    return 0;
}
