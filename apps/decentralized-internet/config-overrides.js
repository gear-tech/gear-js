const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default;
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

module.exports = (config) => {
  config.plugins.push(new webpack.ProvidePlugin({ Buffer: ['buffer', 'Buffer'] }));

  config.plugins.forEach((plugin) => {
    if (plugin instanceof HtmlWebpackPlugin) {
      plugin.userOptions.scriptLoading = 'blocking';
    }
  });

  config.plugins.push(new HtmlInlineScriptPlugin());
  config.plugins.push(new HTMLInlineCSSWebpackPlugin());

  return config;
};