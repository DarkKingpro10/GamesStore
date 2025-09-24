// Control de rutas y autenticación
import { onAuthChange, getCurrentUser, logoutUser } from "../firebase/auth.js";
import {
	showLogoutConfirmation,
	showSuccess,
} from "../utils/alerts.js";

let currentUser = null;
let authInitialized = false;

/**
 * Redirigir al usuario basado en su estado de autenticación
 */
async function redirectBasedOnAuth() {
	// Si no está inicializado, esperar un poco para que Firebase restaure desde IndexedDB
	if (!authInitialized) {
		await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
		
		// Verificar el usuario actual después del timeout
		const firebaseUser = getCurrentUser();
		if (firebaseUser) {
			currentUser = firebaseUser;
		}
	}

	const currentPage = window.location.pathname;
	console.log("Current page:", currentPage, "User:", !!currentUser);

	// Evitar redirecciones múltiples
	if (window.redirecting) {
		console.log("Ya hay una redirección en progreso...");
		return;
	}

	// Si el usuario está autenticado y está en login/registro
	if (
		currentUser &&
		(currentPage.includes("index.html") || currentPage.includes("register") || currentPage === "/")
	) {
		window.redirecting = true;
		window.location.href = "./dashboard/dashboard.html";
		return;
	}

	// Si el usuario NO está autenticado y está en páginas protegidas
	if(!currentUser && currentPage.includes("dashboard")) {
		window.redirecting = true;

		if(window.app?.env?.isElectron){
			window.location.href = "../index.html";
			return;
		}

		window.location.href = "/index.html";
		return;
	}
}

/**
 * Manejar cierre de sesión con confirmación
 */
async function handleLogout() {
	try {
		// Mostrar confirmación
		const confirmed = await showLogoutConfirmation();

		if (confirmed.isConfirmed) {
			const result = await logoutUser();

			if (result.success) {
				await showSuccess("Sesión cerrada", "Has cerrado sesión correctamente");
				console.log("✅ Sesión cerrada");
				location.reload(); // Recargar la página
			}
		}
	} catch (error) {
		console.error("❌ Error cerrando sesión:", error);
	}
}

// Hacer disponible globalmente para compatibilidad
window.handleLogout = handleLogout;

/**
 * Inicializar control de autenticación
 */
export function initAuthControl() {
	console.log("🔐 Inicializando control de autenticación...");
	
	// Observer de cambios de autenticación
	onAuthChange((user) => {
		authInitialized = true; // Marcar como inicializado cuando Firebase dispare el callback
		
		if (user) {
			currentUser = user;
			console.log("✅ Usuario autenticado:", user.email);
			redirectBasedOnAuth();
		} else {
			currentUser = null;
			console.log("👤 Usuario no autenticado");
			redirectBasedOnAuth();
		}
	});

	// Verificar estado inicial con timeout para IndexedDB
	setTimeout(() => {
		if (!authInitialized) {
			console.log("⚠️ Firebase no ha disparado callback, verificando manualmente...");
			redirectBasedOnAuth();
		}
	}, 1500);
}

export default initAuthControl;
