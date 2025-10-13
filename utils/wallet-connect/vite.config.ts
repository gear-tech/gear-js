import { viteConfigs } from '@gear-js/frontend-configs';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { mergeConfig } from 'vite';

export default mergeConfig(viteConfigs.lib({ injectCss: true }), {
  plugins: [basicSsl()],
  server: { host: '127.0.0.1' },
});
