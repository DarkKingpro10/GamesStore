import { registerUser } from '../firebase/auth.js';
import { registerSchema, validateWithZod } from '../validation/schemas.js';
import { initAuthControl } from '../auth/auth-control.js';
import { showError, showRegisterSuccess, showLoading, closeSwal } from '../utils/alerts.js';


const TOGGLE_PASSWORD = document.getElementById("togglePassword");
const TOGGLE_CONFIRM_PASSWORD = document.getElementById(
	"toggleConfirmPassword"
);
const PASSWORD_INPUT = document.getElementById("password");
const CONFIRM_PASSWORD_INPUT = document.getElementById("confirmPassword");
const REGISTER_FORM = document.getElementById("registerForm");
const EMAIL_INPUT = document.getElementById("email");
const NAME_INPUT = document.getElementById("name");

// Toggle para password principal
TOGGLE_PASSWORD.addEventListener("click", () => {
	if (PASSWORD_INPUT.type === "password") {
		PASSWORD_INPUT.type = "text";
		TOGGLE_PASSWORD.innerText = "visibility_off";
	} else {
		PASSWORD_INPUT.type = "password";
		TOGGLE_PASSWORD.innerText = "visibility";
	}
});

// Toggle para confirmar password
TOGGLE_CONFIRM_PASSWORD.addEventListener("click", () => {
	if (CONFIRM_PASSWORD_INPUT.type === "password") {
		CONFIRM_PASSWORD_INPUT.type = "text";
		TOGGLE_CONFIRM_PASSWORD.innerText = "visibility_off";
	} else {
		CONFIRM_PASSWORD_INPUT.type = "password";
		TOGGLE_CONFIRM_PASSWORD.innerText = "visibility";
	}
});

/**
 * Validar el formulario de registro con Zod
 * @returns {Object} - Resultado de la validación
 */
function validateRegisterForm() {
	const formData = {
		name: NAME_INPUT.value.trim(),
		email: EMAIL_INPUT.value.trim(),
		password: PASSWORD_INPUT.value,
		confirmPassword: CONFIRM_PASSWORD_INPUT.value
	};
	
  console.log(formData)

	return validateWithZod(registerSchema, formData);
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
		showError('Error en el registro', message);
	} else if (type === 'success') {
		// Este caso se maneja directamente en handleRegisterSubmit
		// con showRegisterSuccess que es más específico
	}
}

/**
 * Manejar el envío del formulario de registro
 */
async function handleRegisterSubmit(event) {
	event.preventDefault();
	
	console.log('📝 Procesando registro...');
	
	// Validar formulario con Zod
	const validation = validateRegisterForm();
	if (!validation.success) {
    console.log(validation)
    // showError('Error en el registro', validation.message);
		showMessage(validation.message, 'error', validation.field);
		return;
	}
	
	// Deshabilitar el formulario durante el proceso
	const submitButton = REGISTER_FORM.querySelector('button[type="submit"]');
	// const originalText = submitButton.textContent;
	submitButton.disabled = true;
	
	// Mostrar loading con SweetAlert2
	showLoading('Registrando usuario...', 'Por favor espera mientras creamos tu cuenta');
	
	try {
		// Registrar usuario con Firebase
		const result = await registerUser(
			validation.data.email, 
			validation.data.password, 
			validation.data.name
		);
		
		// Cerrar loading
		closeSwal();
		
		if (result.success) {
			// Mostrar éxito con SweetAlert2
			await showRegisterSuccess(validation.data.name);
			
			// Limpiar formulario
			REGISTER_FORM.reset();
			
			// Redirigir al login después del mensaje
			window.location.href = '/dashboard/dashboard.html';
			
		} else {
			showMessage(result.message, 'error');
		}
		
	} catch (error) {
		// Cerrar loading en caso de error
		closeSwal();
		showError('Error inesperado', 'Por favor intenta de nuevo más tarde');
	}
	
	// Rehabilitar el formulario
	submitButton.disabled = false;
}

// Event listener para el formulario
REGISTER_FORM.addEventListener('submit', handleRegisterSubmit);

// Inicializar control de autenticación
// initAuthControl();