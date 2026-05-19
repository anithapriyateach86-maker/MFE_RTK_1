const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/main.jsx",

  devServer: {
    port: 3000,
    historyApiFallback: true,
  },

  output: {
    publicPath: "auto",
  },

  resolve: {
    extensions: [".js", ".jsx"],
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "shellApp",

      remotes: { },

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

    new HtmlWebpackPlugin({	 	  	      	 	    	    	    	    	 	
      template: "./public/index.html",
    }),
  ],
};