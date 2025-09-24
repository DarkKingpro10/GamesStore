// Utilidades para mensajes con SweetAlert2
import Swal from "sweetalert2";

const isModalOpen = () => {
	const modal = document.getElementById("addGameModal");
	console.log(modal);
	if (modal && modal.open) return true;
	return false;
};

/**
 * Configuración personalizada de SweetAlert2 con tema de la app
 */
const customSwal = Swal.mixin({
	customClass: {
		confirmButton: "swal-btn-primary",
		cancelButton: "swal-btn-secondary",
		popup: "swal-popup-custom",
	},
	buttonsStyling: true,
	showClass: {
		popup: "animate__animated animate__fadeInDown animate__faster",
	},
	hideClass: {
		popup: "animate__animated animate__fadeOutUp animate__faster",
	},
});

/**
 * Mostrar mensaje de éxito
 * @param {string} title - Título del mensaje
 * @param {string} text - Texto del mensaje (opcional)
 * @param {number} timer - Tiempo de auto-cierre en ms (opcional)
 */
export function showSuccess(title, text = "", timer = 2000) {
	return customSwal.fire({
		icon: "success",
		title,
		text,
		timer,
		timerProgressBar: true,
		showConfirmButton: false,
		target: isModalOpen() ? document.getElementById("addGameModal") : "body",
	});
}

/**
 * Mostrar mensaje de error
 * @param {string} title - Título del mensaje
 * @param {string} text - Texto del mensaje (opcional)
 */
export function showError(title, text = "") {
	return customSwal.fire({
		icon: "error",
		title,
		text,
		confirmButtonText: "Entendido",
		target: isModalOpen() ? document.getElementById("addGameModal") : "body",
	});
}

/**
 * Mostrar mensaje de información
 * @param {string} title - Título del mensaje
 * @param {string} text - Texto del mensaje (opcional)
 */
export function showInfo(title, text = "") {
	return customSwal.fire({
		icon: "info",
		title,
		text,
		confirmButtonText: "OK",
		target: isModalOpen() ? document.getElementById("addGameModal") : "body",
	});
}

/**
 * Mostrar mensaje de advertencia
 * @param {string} title - Título del mensaje
 * @param {string} text - Texto del mensaje (opcional)
 */
export function showWarning(title, text = "") {
	return customSwal.fire({
		icon: "warning",
		title,
		text,
		confirmButtonText: "Entendido",
		target: isModalOpen() ? document.getElementById("addGameModal") : "body",
	});
}

/**
 * Mostrar confirmación con botones Sí/No
 * @param {string} title - Título del mensaje
 * @param {string} text - Texto del mensaje (opcional)
 * @param {string} confirmButtonText - Texto del botón de confirmación
 * @param {string} cancelButtonText - Texto del botón de cancelación
 * @param {boolean} reverseButtons - Si true: [Confirmar][Cancelar], si false: [Cancelar][Confirmar]
 */
export function showConfirmation(
	title,
	text = "",
	confirmButtonText = "Sí",
	cancelButtonText = "No",
	reverseButtons = true
) {
	return customSwal.fire({
		icon: "question",
		title,
		text,
		showCancelButton: true,
		confirmButtonText,
		cancelButtonText,
		reverseButtons,
		target: isModalOpen() ? document.getElementById("addGameModal") : "body",
	});
}

/**
 * Mostrar mensaje de loading/procesando
 * @param {string} title - Título del mensaje
 * @param {string} text - Texto del mensaje (opcional)
 */
export function showLoading(
	title = "Procesando...",
	text = "Por favor espera"
) {
	return customSwal.fire({
		title,
		text,
		allowOutsideClick: false,
		allowEscapeKey: false,
		showConfirmButton: false,
    target: isModalOpen() ? document.getElementById("addGameModal") : "body",
		didOpen: () => {
			Swal.showLoading();
		},
	});
}

/**
 * Cerrar cualquier SweetAlert abierto
 */
export function closeSwal() {
	Swal.close();
}

/**
 * Mensaje específico para autenticación exitosa
 * @param {string} email - Email del usuario autenticado
 */
export function showAuthSuccess(email) {
	return showSuccess("¡Bienvenido!", `Sesión iniciada como ${email}`, 2500);
}

/**
 * Mensaje específico para registro exitoso
 * @param {string} name - Nombre del usuario registrado
 */
export function showRegisterSuccess(name) {
	return showSuccess(
		"¡Registro exitoso!",
		`Bienvenido ${name}, tu cuenta ha sido creada`,
		3000
	);
}

/**
 * Mensaje para usuario ya autenticado
 * @param {string} email - Email del usuario autenticado
 */
export async function showAlreadyAuthenticated(email) {
	const result = await customSwal.fire({
		icon: "info",
		title: "Ya estás autenticado",
		text: `Sesión activa como ${email}`,
		showCancelButton: true,
		confirmButtonText: "Cerrar Sesión",
		cancelButtonText: "Continuar",
		reverseButtons: true,
	});

	return result.isConfirmed; // true si quiere cerrar sesión
}

/**
 * Confirmación para cerrar sesión
 */
export function showLogoutConfirmation() {
	return showConfirmation(
		"¿Cerrar sesión?",
		"Se cerrará tu sesión actual",
		"Sí, cerrar",
		"Cancelar"
	);
}

export default {
	showSuccess,
	showError,
	showInfo,
	showWarning,
	showConfirmation,
	showLoading,
	closeSwal,
	showAuthSuccess,
	showRegisterSuccess,
	showAlreadyAuthenticated,
	showLogoutConfirmation,
};
