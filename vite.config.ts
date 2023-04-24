import { sveltekit } from '@sveltejs/kit/vite';
import svg from '@poppanator/sveltekit-svg';
import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
	plugins: [
		basicSsl(),
		sveltekit(),
		svg({
			svgoOptions: {
				multipass: true,
				plugins: [
				  {
					name: 'preset-default',
					// by default svgo removes the viewBox which prevents svg icons from scaling
					// not a good idea! https://github.com/svg/svgo/pull/1461
					params: { overrides: { removeViewBox: false } },
				  },
				  { name: 'removeAttrs', params: { attrs: '(fill|stroke)' } },
				],
			  },
		})
	]
});
