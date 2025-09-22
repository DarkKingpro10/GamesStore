import { app, BrowserWindow, ipcMain, shell } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Detectar si estamos en desarrollo
const isDev = !app.isPackaged || process.env.NODE_ENV === "development";

/**
 * Crea la ventana principal
 */
function createWindow() {
	const win = new BrowserWindow({
		width: 1000,
		height: 700,
		minWidth: 360,
		minHeight: 480,
		autoHideMenuBar: true, // ocultar barra de menú
		show: false, // mostrar cuando esté listo
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			devTools: isDev ? true : false,
			sandbox: true, // Siempre habilitado para máxima seguridad
			// Configuraciones necesarias SOLO para desarrollo con Vite HMR:
			webSecurity: false, // Permitir recursos externos (CDNs, Google, etc.)
			allowRunningInsecureContent: isDev, // Permite contenido mixto HTTP/HTTPS
			preload: path.join(__dirname, "preload.js"),
		},
	});

	// // Load the index.html of the app.
	// win.loadFile("index.html");

	if (isDev) {
		// En desarrollo, cargar desde el servidor de Vite
		win.loadURL("http://127.0.0.1:5175");
	} else {
		// En producción, cargar el archivo HTML construido
		win.loadFile(path.join(__dirname, "..", "dist", "index.html"));
	}

	win.once("ready-to-show", () => {
		win.show();
		win.maximize(); // Maximizar la ventana al iniciar
	});

	// Deshabilitar navegación atrás/adelante en Electron
	win.webContents.on('before-input-event', (event, input) => {
		// Deshabilitar Alt+Left (atrás) y Alt+Right (adelante)
		if (input.alt && (input.key === 'ArrowLeft' || input.key === 'ArrowRight')) {
			event.preventDefault();
		}
		// Deshabilitar teclas de navegación del mouse si las hay
		if (input.key === 'BrowserBack' || input.key === 'BrowserForward') {
			event.preventDefault();
		}
	});

	// Deshabilitar el menú contextual con "Atrás" y "Adelante"
	win.webContents.on('context-menu', (event, params) => {
		event.preventDefault(); // Opcional: deshabilitar menú contextual completamente
	});

	// Bloquear navegación fuera de la app (file://) y abrir https externamente
	// Solo en producción - en desarrollo permitir navegación para HMR
	if (!isDev) {
		win.webContents.on("will-navigate", (event, url) => {
			const isLocal = url.startsWith("file://");
			if (!isLocal) {
				event.preventDefault();
				if (/^https:\/\//i.test(url)) shell.openExternal(url);
			}
		});
	}

	// // Denegar nuevas ventanas; si es https, abrir en navegador
	win.webContents.setWindowOpenHandler(({ url }) => {
		if (/^https:\/\//i.test(url)) {
			shell.openExternal(url);
		}
		return { action: "deny" };
	});

	return win;
}

app.whenReady().then(() => {
	createWindow();

	// IPC para permitir controles de ventana desde el renderer (via preload)
	ipcMain.handle("window:action", (event, action) => {
		const bw = BrowserWindow.fromWebContents(event.sender);
		if (!bw) return;
		switch (action) {
			case "minimize":
				bw.minimize();
				break;
			case "maximize-restore":
				if (bw.isMaximized()) bw.unmaximize();
				else bw.maximize();
				break;
			case "close":
				bw.close();
				break;
			default:
				break;
		}
	});

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
