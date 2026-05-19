// cart-mfe/webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/main.jsx",
  devServer: {
    port: 4202,
    historyApiFallback: true,
    headers: { "Access-Control-Allow-Origin": "*" },
  },
  output: { publicPath: "http://localhost:4202/" },
  resolve: { extensions: [".js", ".jsx"] },
  module: {
    rules: [
      { test: /\.jsx?$/, loader: "babel-loader", exclude: /node_modules/ },
      { test: /\.css$/,  use: ["style-loader", "css-loader"] },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "cartApp",
      filename: "remoteEntry.js",
      exposes: {
        "./CartApp":   "./src/App",
        "./CartStore": "./src/cartStore",
      },
      remotes: {
        // Cart MFE needs to read Zustand store from Orders MFE
        // ordersApp: "ordersApp@http://localhost:4204/remoteEntry.js",
      },
      shared: {
        react:              { singleton: true, eager: true, requiredVersion: "^19.0.0" },
        "react-dom":        { singleton: true, eager: true, requiredVersion: "^19.0.0" },
        "react-router-dom": { singleton: true, eager: true, requiredVersion: "^7.0.0" },
        zustand: { singleton: true, eager: true, requiredVersion: "^5.0.0" },
      },
    }),
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
  ],
};	 	  	      	 	    	    	    	    	 	
