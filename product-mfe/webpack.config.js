const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/main.jsx",
  devServer: {
    port: 4201,
    historyApiFallback: true,
    headers: {
        "Access-Control-Allow-Origin": "*",   // ← ADD THIS
    },
  },
  output: { publicPath: "http://localhost:4201/" },
  resolve: { extensions: [".js", ".jsx"] },
  module: {
    rules: [
      { test: /\.jsx?$/, loader: "babel-loader", exclude: /node_modules/ },
      { test: /\.css$/,  use: ["style-loader", "css-loader"] },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "productApp",
      filename: "remoteEntry.js",
      exposes: {
        "./ProductsApp": "./src/App",
      },
      remotes: {
        cartApp: "cartApp@http://localhost:4202/remoteEntry.js",
      },
      shared: {
  react: {
    singleton: true,
    eager: true,
    requiredVersion: "^19.0.0",   // ← was ^18.0.0, now matches 19.2.6
  },
  "react-dom": {	 	  	      	 	    	    	    	    	 	
    singleton: true,
    eager: true,
    requiredVersion: "^19.0.0",   // ← was ^18.0.0, now matches 19.2.6
  },
  "react-router-dom": {
    singleton: true,
    eager: true,
    requiredVersion: "^7.0.0",    // ← was ^6.0.0, now matches 7.15.0
  },
  zustand: { singleton: true, eager: true, requiredVersion: "^5.0.0" },

},
    }),
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
  ],
};