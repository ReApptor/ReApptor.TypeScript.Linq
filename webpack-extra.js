"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const original = require('@nrwl/react/plugins/webpack.js');

function getWebpackConfig(config) {
  config.module.rules.push(
    {
      test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }
      ]
    }
  );

  return original(config);
}

module.exports = getWebpackConfig;
