const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const baseDir = path.resolve(__dirname);
const srcDir = path.resolve(baseDir, 'lib');
const buildDir = path.resolve(baseDir, 'build');
const modulesDir = path.join(baseDir, 'node_modules');

module.exports = {
    mode: 'production',

    experiments: {
        asyncWebAssembly: true
    },

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
        react: 'react',
        three: {
            commonjs: 'three',
            commonjs2: 'three',
            amd: 'three',
            root: 'THREE',
        }
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
                test: /\.worker\.js$/,
                loader: 'worker-loader',
                options: {
                    inline: 'no-fallback'
                }
            }
        ]
    },

    resolve: {
        extensions: ['.js'],
        modules: [
            srcDir,
            'node_modules'
        ]
    },

    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    module: true,
                    keep_fnames: true
                }
            })
        ]
    }
};
