import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			'/api': {
				target: 'https://talaba-hub-backend-1013a4d5cf14.herokuapp.com',
				changeOrigin: true,
			},
		},
	},
})
