import { loginUser, onAuthChange } from '../firebase/auth.js';
import { loginSchema, validateWithZod } from '../validation/schemas.js';
import { initAuthControl } from '../auth/auth-control.js';
import { showError, showAuthSuccess, showLoading, closeSwal } from '../utils/alerts.js';

console.log("GamesStore UI cargada");

const TOGGLE_PASSWORD = document.getElementById("togglePassword");
const PASSWORD_INPUT = document.getElementById("password");
const LOGIN_FORM = document.getElementById("loginForm");
const EMAIL_INPUT = document.getElementById("email");

TOGGLE_PASSWORD.addEventListener("click", () => {
	if (PASSWORD_INPUT.type === "password") {
		PASSWORD_INPUT.type = "text";
		TOGGLE_PASSWORD.innerText = "visibility_off";
	} else {
		PASSWORD_INPUT.type = "password";
		TOGGLE_PASSWORD.innerText = "visibility";
	}
});

/**
 * Validar el formulario de login con Zod
 * @returns {Object} - Resultado de la validación
 */
function validateLoginForm() {
	const formData = {
		email: EMAIL_INPUT.value.trim(),
		password: PASSWORD_INPUT.value
	};
	
	return validateWithZod(loginSchema, formData);
}

/**
 * Mostrar mensaje usando SweetAlert2
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de mensaje ('error' o 'success')
 * @param {string} field - Campo específico que tiene error (opcional)
 */
function showMessage(message, type = 'error', field = null) {
	// Remover estilos de error de campos anteriores
	document.querySelectorAll('.input-field--error').forEach(field => {
		field.classList.remove('input-field--error');
	});
	
	// Resaltar campo específico si se proporciona
	if (field && type === 'error') {
		const fieldElement = document.getElementById(field);
		if (fieldElement) {
			fieldElement.closest('.input-field').classList.add('input-field--error');
		}
	}
	
	// Mostrar mensaje con SweetAlert2
	if (type === 'error') {
		showError('Error en el inicio de sesión', message);
	}
}

/**
 * Manejar el envío del formulario de login
 */
async function handleLoginSubmit(event) {
	event.preventDefault();
	
	console.log('🔐 Procesando login...');
	
	// Validar formulario con Zod
	const validation = validateLoginForm();
	if (!validation.success) {
		showMessage(validation.message, 'error', validation.field);
		return;
	}
	
	// Deshabilitar el formulario durante el proceso
	const submitButton = LOGIN_FORM.querySelector('button[type="submit"]');
	const originalText = submitButton.textContent;
	submitButton.disabled = true;
	
	// Mostrar loading con SweetAlert2
	showLoading('Iniciando sesión...', 'Verificando tus credenciales');
	
	try {
		// Iniciar sesión con Firebase
		const result = await loginUser(validation.data.email, validation.data.password);
		
		// Cerrar loading
		closeSwal();
		
		if (result.success) {
			// Mostrar éxito con SweetAlert2
			await showAuthSuccess(result.user.email);
			
			// Limpiar formulario
			LOGIN_FORM.reset();
			
			// La redirección se manejará automáticamente por el auth observer
			console.log('🎯 Login exitoso, el usuario será redirigido automáticamente');
			
		} else {
			showMessage(result.message, 'error');
		}
		
	} catch (error) {
		// Cerrar loading en caso de error
		closeSwal();
		console.error('❌ Error inesperado:', error);
		showError('Error inesperado', 'Por favor intenta de nuevo más tarde');
	}
	
	// Rehabilitar el formulario
	submitButton.disabled = false;
}

// Event listener para el formulario
if (LOGIN_FORM) {
	LOGIN_FORM.addEventListener('submit', handleLoginSubmit);
}

// Inicializar control de autenticación
initAuthControl();
