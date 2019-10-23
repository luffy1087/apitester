var path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './assets/app.js',
    output: {
      filename: 'app.bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    externals: nodeExternals(),
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader'
                }
            }
        ]
    },
    target: 'node'
};