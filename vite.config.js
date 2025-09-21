import { defineConfig } from "vite";

// Permite targets diferentes según el entorno (web vs desktop/Electron)
export default defineConfig(({ command, mode }) => {
	return {
		// Configuración para desarrollo
		server: {
			port: 5175,
			strictPort: true,
			cors: true,
			// Configuración para que Electron pueda acceder al servidor de desarrollo
			host: "127.0.0.1",
			// // Mejorar HMR para Electron
			// hmr: {
			// 	host: "127.0.0.1",
			// 	port: 5176
			// },
			// Configuración adicional para Electron
			origin: "http://127.0.0.1:5175"
		},

		// Configuración para build
		build: {
			outDir: "dist",
			sourcemap: true,
			// Mantener la estructura para Electron
			rollupOptions: {
				input: {
					main: "./index.html",
				},
			},
		},

		// Configuración base para assets
		base: "./",
		
		// Configuración específica para desarrollo
		optimizeDeps: {
			exclude: ['electron']
		}
	};
});
