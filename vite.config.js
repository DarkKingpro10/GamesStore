import { defineConfig } from "vite";
import path from "path";

// Permite targets diferentes según el entorno (web vs desktop/Electron)
export default defineConfig(({ command, mode }) => {
	return {
		root: "src",
		// Especificar donde buscar archivos .env (en la raíz del proyecto)
		envDir: "../",
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
			outDir: "../dist", // Relativo al root (src), así va a la raíz del proyecto
			sourcemap: true,
			// Mantener la estructura para Electron
			rollupOptions: {
				input: {
					main: "src/index.html",
					register: "src/register/register.html",
				},
			},
			// Asegurar que las rutas relativas se resuelvan correctamente
			emptyOutDir: true,
		},

		// Configuración base para assets
		base: "./",
		
		// Configuración específica para desarrollo
		optimizeDeps: {
			exclude: ['electron']
		}
	};
});
