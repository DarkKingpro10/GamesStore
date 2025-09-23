// Archivo general para inicialización global del renderer
// Vite soporta importar CSS directamente desde JS, lo que lo inyecta en el bundle
import initAuthControl from "./auth/auth-control.js";
import "./styles.css";
import "./styles/sweetalert.css";

export const LINKS_EXTERNAL = Object.freeze([
	Object.freeze({
		rel: "stylesheet", //Iconos
		URL: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0",
	}),
	Object.freeze({
		rel: "preconnect",
		URL: "https://fonts.googleapis.com",
	}),
	Object.freeze({
		rel: "preconnect",
		URL: "https://fonts.gstatic.com",
		options: {
			crossOrigin: true,
		},
	}),
	Object.freeze({
		rel: "stylesheet",
		URL: "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap", //Fuente Roboto
	}),
]);

/**
 * Carga dinámicamente los enlaces externos (CSS, preconnect, etc.)
 */
export function loadExternalLinks() {
	LINKS_EXTERNAL.forEach((linkConfig) => {
		// Verificar si el enlace ya existe para evitar duplicados
		const existingLink = document.querySelector(
			`link[href="${linkConfig.URL}"]`
		);
		if (existingLink) {
			console.log(`📎 Link ya cargado: ${linkConfig.URL}`);
			return;
		}

		// Crear el elemento link
		const link = document.createElement("link");
		link.rel = linkConfig.rel;
		link.href = linkConfig.URL;

		// Añadir opciones adicionales si existen
		if (linkConfig.options) {
			Object.entries(linkConfig.options).forEach(([key, value]) => {
				if (key === "crossOrigin") {
					link.crossOrigin = value;
				} else {
					link.setAttribute(key, value);
				}
			});
		}

		link.onerror = () => {
			console.error(`❌ Error al cargar link: ${linkConfig.URL}`);
		};

		// Añadir al head del documento
		document.head.appendChild(link);
	});
}

/**
 * Función de inicialización que se ejecuta cuando el DOM está listo
 */
export async function initializeApp() {
	console.log('🚀 Inicializando aplicación...');
	
	// Cargar enlaces externos
	loadExternalLinks();
	
	// Detectar si estamos en Electron
	if (window.app?.env?.isElectron) {
		console.log('🖥️ Ejecutándose en Electron');
		document.body.classList.add('electron-app');
		
		// Deshabilitar navegación de historial en Electron
		try {
			const { disableHistoryNavigation } = await import('./electron/navigation-control.js');
			disableHistoryNavigation();
		} catch (error) {
			console.warn('No se pudo cargar control de navegación:', error);
		}
	} else {
		console.log('🌐 Ejecutándose en navegador web');
		document.body.classList.add('web-app');
	}

	// Añadir clase para indicar que la app está ready
	document.body.classList.add('app-ready');
}

// Ejecutar cuando el DOM esté listo
(() => {
	initAuthControl();
	document.addEventListener("DOMContentLoaded", initializeApp);
})();
