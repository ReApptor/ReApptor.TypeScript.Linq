const path = require('path');
const tsNameof = require('ts-nameof');
const nodeExternals = require('webpack-node-externals');



const configuration = {
    mode: 'production',
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder 
    devtool: 'source-map',
    entry: {
        index: path.join(__dirname, 'src', 'index.ts')
    },
    target: 'node',
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    optimization: {
        concatenateModules: false,
        // usedExports: false,
        minimize: false,
        // providedExports: false
    },
    module: {
        rules: [
            {
                test: /\.s(a|c)ss$/,
                exclude:[/node_modules/],
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: { modules: true }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.tsx?$/,
                exclude:[/node_modules/],
                use: [

                    {
                        loader: "ts-loader", // or awesome-typescript-loader
                        options: {
                            getCustomTransformers: () => ({ before: [tsNameof] }),
                            onlyCompileBundledFiles: true
                        }

                    }]
            }
        ]
    },
    output: {
        filename: '[name].es.js',
        path: path.resolve(__dirname, 'lib'),
        libraryTarget: 'commonjs',
        globalObject: 'this'

    }
}

module.exports =  configuration;