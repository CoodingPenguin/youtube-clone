const path = require("path");
const autoprefixer = require("autoprefixer");
const ExtractCSS = require("extract-text-webpack-plugin");

const MODE = process.env.WEBPACK_ENV;
const ENTRY_FILE = path.resolve(__dirname, "assets", "js", "main.js");
const OUTPUT_DIR = path.join(__dirname, "static");

const config = {
  entry: ["@babel/polyfill", ENTRY_FILE],
  mode: MODE,
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      },
      {
        test: /\.(scss)$/,
        use: ExtractCSS.extract([
          // 4. extract only css and make styles.css
          {
            loader: "css-loader" // 3. compatible css -> load css
          },
          {
            loader: "postcss-loader", // 2. css -> compatible css
            options: {
              plugins: () => {
                return [autoprefixer({ Browserslist: "cover 99.5%" })];
              }
            }
          },
          {
            loader: "sass-loader" // 1. sass -> css
          }
        ])
      }
    ]
  },
  output: {
    path: OUTPUT_DIR,
    filename: "[name].js"
  },
  plugins: [new ExtractCSS("styles.css")]
};

module.exports = config;
