// Control de rutas y autenticación
import { onAuthChange, getCurrentUser } from "../firebase/auth.js";
import {
	showLogoutConfirmation,
	showSuccess,
} from "../utils/alerts.js";

/**
 * Redirigir al usuario basado en su estado de autenticación
 */
async function redirectBasedOnAuth() {
	const currentUser = getCurrentUser();
	const currentPage = window.location.pathname;
console.log("Redirigiendo al dashboard...");
	// Si el usuario está autenticado y está en login/registro
	if (
		currentUser &&
		(currentPage.includes("index.html") || currentPage.includes("register") || currentPage === "/")
	) {
		// Redirigir al dashboard
    console.log("Redirigiendo al dashboard...");
		window.location.href = "/dashboard/dashboard.html";
	}

	// Si el usuario NO está autenticado y está en páginas protegidas
	// TODO: Implementar cuando tengas páginas que requieran autenticación
}

/**
 * Manejar cierre de sesión con confirmación
 */
async function handleLogout() {
	try {
		// Mostrar confirmación
		const confirmed = await showLogoutConfirmation();

		if (confirmed.isConfirmed) {
			const { logoutUser } = await import("../firebase/auth.js");
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
	// Observer de cambios de autenticación
	onAuthChange((user) => {
		if (user) {
			console.log("✅ Usuario autenticado:", user.email);
			redirectBasedOnAuth();
		} else {
			console.log("👤 Usuario no autenticado");
		}
	});

	// Verificar estado inicial
	redirectBasedOnAuth();
}

export default initAuthControl;
