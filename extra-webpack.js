"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const original = require("@nrwl/react/plugins/webpack.js");
const tsNameOf = require("ts-nameof");

function getWebpackConfig(config) {
    
    console.log("--- extra-webpack.js ---");

    config.module.rules.push(
        {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: [
                {
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        outputPath: "fonts/"
                    }
                }
            ]
        }
    );

    config.module.rules.push(
        {
            test: /\.tsx?$/,
            use: [
                {
                    loader: "ts-loader", // or awesome-typescript-loader
                    options: {
                        getCustomTransformers: () => ({before: [ tsNameOf ], after: [  ]}),
                    },
                }
            ]
        }
    );

    return original(config);
}

module.exports = getWebpackConfig;
