const assert = require('assert');
const { ProvidePlugin } = require('webpack');

module.exports = {
  webpack: {
    plugins: {
      add: [
        new ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
      ],
    },
    configure: (config) => {
      assert.notStrictEqual(process.env.REACT_APP_NODE_ADDRESS, undefined, 'REACT_APP_NODE_ADDRESS not provided');
      assert.notStrictEqual(process.env.REACT_APP_API_URL, undefined, 'REACT_APP_API_URL not provided');
      assert.notStrictEqual(
        process.env.REACT_APP_WASM_COMPILER_URL,
        undefined,
        'REACT_APP_WASM_COMPILER_URL not provided'
      );
      assert.notStrictEqual(process.env.REACT_APP_RRT, undefined, 'REACT_APP_RRT not provided');
      assert.notStrictEqual(
        process.env.REACT_APP_DEFAULT_NODES_URL,
        undefined,
        'REACT_APP_DEFAULT_NODES_URL not provided'
      );

      config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: require.resolve('buffer/'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
      };

      config.resolve.alias = {
        ...config.resolve.alias,
        'react/jsx-dev-runtime': 'react/jsx-dev-runtime.js',
        'react/jsx-runtime': 'react/jsx-runtime.js',
      };

      return config;
    },
  },
};
