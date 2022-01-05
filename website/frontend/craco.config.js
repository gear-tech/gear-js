const assert = require('assert');

module.exports = {
  webpack: {
    configure: (config) => {
      assert.notStrictEqual(process.env.REACT_APP_NODE_ADDRESS, undefined, 'REACT_APP_NODE_ADDRESS not provided');
      assert.notStrictEqual(process.env.REACT_APP_API_URL, undefined, 'REACT_APP_API_URL not provided');
      assert.notStrictEqual(
        process.env.REACT_APP_WASM_COMPILER_URL,
        undefined,
        'REACT_APP_WASM_COMPILER_URL not provided'
      );
      assert.notStrictEqual(process.env.REACT_APP_RRT, undefined, 'REACT_APP_RRT not provided');

      return config;
    },
  },
};
