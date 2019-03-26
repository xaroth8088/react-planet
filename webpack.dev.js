const path = require('path');
const webpack = require('webpack');

const baseDir = path.resolve(__dirname);
const srcDir = path.resolve(baseDir, 'lib');
const buildDir = path.resolve(baseDir, 'build');
const modulesDir = path.join(baseDir, 'node_modules');

module.exports = {
    mode: 'development',

    entry: [
        'views/Planet.js'
    ],

    output: {
        path: buildDir,
        filename: 'index.js',
        publicPath: '',
        library: 'ReactPlanet',
        libraryTarget: 'umd'
    },

    externals: {
        react: 'react'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-react'
                    ]
                },
                include: srcDir,
                exclude: modulesDir
            },
            {
                test: /\.wsm$/,
                type: 'javascript/auto',
                use: [{
                    loader: 'wasm-loader',
                    options: {}
                }]
            }
        ]
    },

    resolve: {
        extensions: ['.js', '.wsm'],
        modules: [
            srcDir,
            'node_modules'
        ]
    },

    watch: true
};
