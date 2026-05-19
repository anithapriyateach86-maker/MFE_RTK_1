// profile-mfe/webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/main.jsx",
  devServer: {
    port: 4206,
    historyApiFallback: true,
    headers: { "Access-Control-Allow-Origin": "*" },
  },
  output: { publicPath: "http://localhost:4206/" },
  resolve: { extensions: [".js", ".jsx"] },
  module: {
    rules: [
      { test: /\.jsx?$/, loader: "babel-loader", exclude: /node_modules/ },
      { test: /\.css$/,  use: ["style-loader", "css-loader"] },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "profileApp",
      filename: "remoteEntry.js",
      exposes: {
        "./ProfileApp": "./src/ProfileApp",
      },
      shared: {
        react:              { singleton: true, eager: true, requiredVersion: "^19.0.0" },
        "react-dom":        { singleton: true, eager: true, requiredVersion: "^19.0.0" },
        "react-router-dom": { singleton: true, eager: true, requiredVersion: "^7.0.0" },
        "@reduxjs/toolkit": { singleton: true, eager: true, requiredVersion: "^2.0.0" },
        "react-redux":      { singleton: true, eager: true, requiredVersion: "^9.0.0" },
      },
    }),
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
  ],
};	 	  	      	 	    	    	    	    	 	
