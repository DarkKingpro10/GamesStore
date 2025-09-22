console.log("🔐 Página de registro cargada");

const TOGGLE_PASSWORD = document.getElementById("togglePassword");
const TOGGLE_CONFIRM_PASSWORD = document.getElementById(
	"toggleConfirmPassword"
);
const PASSWORD_INPUT = document.getElementById("password");
const CONFIRM_PASSWORD_INPUT = document.getElementById("confirmPassword");

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