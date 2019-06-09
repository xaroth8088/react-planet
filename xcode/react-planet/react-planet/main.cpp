//
//  main.cpp
//  react-planet
//
//  Created by Geoffrey Benson on 6/9/19.
//  Copyright © 2019 Geoffrey Benson. All rights reserved.
//

#include <iostream>
#include "wasm/TextureGenerator.h"

int main(int argc, const char * argv[]) {
    TextureGenerator* test = new TextureGenerator();
    test->GenerateTextures();
    
    std::cout << test->cloudBuffer << "\n";
    
    return 0;
}
