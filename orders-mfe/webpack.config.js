// orders-mfe/webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/main.jsx",
  devServer: {
    port: 4204,
    historyApiFallback: true,
    headers: { "Access-Control-Allow-Origin": "*" },
  },
  output: { publicPath: "http://localhost:4204/" },  // ← absolute path
  resolve: { extensions: [".js", ".jsx"] },
  module: {
    rules: [
      { test: /\.jsx?$/, loader: "babel-loader", exclude: /node_modules/ },
      { test: /\.css$/,  use: ["style-loader", "css-loader"] },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "ordersApp",
      filename: "remoteEntry.js",
      exposes: {
        "./OrdersApp":   "./src/OrdersApp",
        "./orderStore":  "./src/store/orderStore",  // ← expose store
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
