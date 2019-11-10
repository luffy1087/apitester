const htmlPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './assets/app.js',
    output: {
      filename: 'app.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: {
                   loader: 'html-loader',
                   options: { minimize: true }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            }
        ]
    },
    plugins: [
        new htmlPlugin({
            template: './assets/index.html',
            filename: 'index.html'
        })
    ]
};