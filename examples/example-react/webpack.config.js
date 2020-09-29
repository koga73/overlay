const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const filename = "example";

//Webpack config
module.exports = {
	devServer: {
		contentBase: "www",
		stats: "errors-only",
		host: process.env.HOST, // Defaults to `localhost`
		port: process.env.PORT, // Defaults to 8080
		open: true, // Open the page in browser
		overlay: true //For errors
	},
	mode: "production",
	entry: ["@babel/polyfill", `./src/${filename}.jsx`],
	output: {
		path: path.join(__dirname, "www"),
		filename: `js/${filename}.min.js`
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				resolve: {
					extensions: [".js", ".jsx"]
				},
				use: {
					loader: "babel-loader",
					options: {
						extends: "./babel.config.js"
					}
				}
			},
			{
				test: /\.(css|sass|scss)$/,
				loaders: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: "sass-loader",
						options: {
							implementation: require("sass")
						}
					}
				]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: `css/${filename}.min.css`
		})
	]
};
