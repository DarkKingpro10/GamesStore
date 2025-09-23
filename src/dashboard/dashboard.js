import initAuthControl from "../auth/auth-control";
import { logoutUser } from "../firebase/auth";
import { showLogoutConfirmation } from "../utils/alerts";

const LOGOUT_BUTTON = document.getElementById("logoutButton");

initAuthControl();

LOGOUT_BUTTON.addEventListener("click", async () => {
	try {
		const result = await showLogoutConfirmation();

		if (result.isConfirmed) {
			logoutUser();
		}
	} catch (error) {
		console.error("Error al cerrar sesión:", error);
	}
});
