import { viteConfigs } from '@gear-js/frontend-configs';
import { mergeConfig, type Plugin } from 'vite';

// vite-plugin-node-polyfills (from shared config) polyfills `process.cwd` as a global,
// which tricks kzg-wasm's loader into taking the Node.js code path in the browser.
// This plugin patches out the Node.js WASM loader call so the browser Emscripten build
// handles WASM loading via fetch instead.
function kzgWasmBrowserFix(): Plugin {
  return {
    name: 'kzg-wasm-browser-fix',
    enforce: 'pre',
    transform(code, id) {
      if (id.includes('kzg-wasm') && code.includes('await loadWasmModule()')) {
        return { code: code.replace('await loadWasmModule()', 'undefined'), map: null };
      }
    },
  };
}

export default mergeConfig(viteConfigs.app, {
  css: { preprocessorOptions: { scss: { additionalData: '@use "@/shared/utils/styles/_breakpoints" as *;' } } },
  optimizeDeps: {
    exclude: ['kzg-wasm'],
  },
  plugins: [kzgWasmBrowserFix()],
});
