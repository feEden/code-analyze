const {resolve} = require("path");
const MyPlugin = require("./plugins/my-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    module: {
        rules: [
          /* {
            test: /\.js$/,
            use: {
              loader: resolve("./loader/my-loader.js"),
              options: {
                data:"自定义loader"
              }
            }
          } */
        ]
    },
    plugins:[
      new HTMLWebpackPlugin(),
      new MyPlugin(),
    ]
};