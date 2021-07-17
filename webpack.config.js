const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');
const fs = require('fs');

const directoryPath = path.join(__dirname, '/src/labs');

const folderScanPromise = new Promise((res, rej) => {
    const chunks = [];
    const entries = {}
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Unable to scan directory: ' + err);
            rej(err);
        }
        //listing all files using forEach
        files.forEach(folder => {

            chunks.push(new HtmlWebpackPlugin({
                filename: `${folder}/index.html`,
                template: path.join(directoryPath, `${folder}/index.html`),
                chunks: [folder]
            }))
            entries[folder] = path.join(directoryPath, `${folder}/index.js`)
        });
        res({chunks, entries})
    });
})

module.exports = () => folderScanPromise.then(({chunks, entries}) => {
    return {
        entry: entries,
        output: {
            filename: './[name]/index.js',
        },
        plugins: [
            ...chunks,
            new HtmlWebpackPlugin({
                filename: './index.html',
                template: path.join(__dirname, '/src/static/index.html'),
                chunks: ['main']
            }),
            new MiniCssExtractPlugin({
                filename: "[name]/styles.css",
                chunkFilename: "[id].css"
            })
        ],
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            compress: true,
            port: 9000,
            open: true
        },
        module: {
            rules: [
                {
                    test: /\.s?css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "sass-loader"
                    ]
                }
            ]
        }
    }
})
