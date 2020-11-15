//
//  main.cpp
//  react-planet
//
//  Created by Geoffrey Benson on 6/9/19.
//  Copyright © 2019 Geoffrey Benson. All rights reserved.
//

// This is effectively the unit test wrapping program

#include <iostream>
#include "wasm/TextureGenerator.h"

int main() {
    std::cout << "BEGIN PROFILING\n";
    TextureGenerator* test = new TextureGenerator();
    test->resolution = 2048;
    test->init();
    test->GenerateTextures();

    delete test;
    std::cout << "END PROFILING\n";

    return 0;
}
