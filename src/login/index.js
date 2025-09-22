console.log("GamesStore UI cargada");

const TOGGLE_PASSWORD = document.getElementById("togglePassword");
const PASSWORD_INPUT = document.getElementById("password");

TOGGLE_PASSWORD.addEventListener("click", () => {
	if (PASSWORD_INPUT.type === "password") {
		PASSWORD_INPUT.type = "text";
		TOGGLE_PASSWORD.innerText = "visibility_off";
	} else {
		PASSWORD_INPUT.type = "password";
		TOGGLE_PASSWORD.innerText = "visibility";
	}
});

// // Navegación interna para Electron
// function navigateToPage(pageName) {
// 	console.log(`🔄 Navegando a: ${pageName}`);
	
// 	// La ruta es la misma tanto en desarrollo como en producción
// 	const targetUrl = `./src/${pageName}/${pageName}.html`;
	
// 	console.log(`🎯 Navegando a: ${targetUrl}`);
// 	window.location.href = targetUrl;
// }

// // Manejar clicks en links de navegación
// document.addEventListener('click', (event) => {
// 	const link = event.target.closest('[data-page]');
// 	if (link) {
// 		event.preventDefault(); // Evitar navegación por defecto
// 		const pageName = link.getAttribute('data-page');
// 		navigateToPage(pageName);
// 	}
// });
