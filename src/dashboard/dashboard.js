import initAuthControl from "../auth/auth-control";
import { logoutUser } from "../firebase/auth";
import {
	showLogoutConfirmation,
	showSuccess,
	showError,
	showLoading,
	closeSwal,
	showConfirmation,
} from "../utils/alerts";
import {
	getGenres,
	getPlatforms,
	getGames,
	addGame,
	deleteGame,
	updateGame,
} from "../firebase/firestore";

// Elementos del DOM
const LOGOUT_BUTTON = document.getElementById("logoutButton");
const ADD_GAME_BUTTON = document.getElementById("addGameButton");
const ADD_GAME_MODAL = document.getElementById("addGameModal");
const ADD_GAME_FORM = document.getElementById("addGameForm");
const CANCEL_BUTTON = document.getElementById("cancelButton");
const GAMES_LIST = document.getElementById("games-list");
const GAME_GENRE_SELECT = document.getElementById("gameGenre");
const GAME_PLATFORM_SELECT = document.getElementById("gamePlatform");
const SEARCH_INPUT = document.getElementById("search");

// Variables globales
let genresData = [];
let platformsData = [];
let gamesData = [];
let filteredGamesData = [];
let isEditMode = false;
let currentEditingGame = null;

document.addEventListener("DOMContentLoaded", initApp);

// Event listeners
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

ADD_GAME_BUTTON.addEventListener("click", openModal);
CANCEL_BUTTON.addEventListener("click", closeModal);
ADD_GAME_FORM.addEventListener("submit", handleAddGame);

// Event listener para búsqueda
SEARCH_INPUT.addEventListener("input", handleSearch);

// Cerrar modal al hacer clic en el backdrop del dialog
ADD_GAME_MODAL.addEventListener("click", (e) => {
	if (e.target === ADD_GAME_MODAL) {
		closeModal();
	}
});

// Cerrar modal con la tecla Escape (manejado automáticamente por dialog)
ADD_GAME_MODAL.addEventListener("cancel", (e) => {
	// El evento cancel se dispara cuando se presiona Escape
	e.preventDefault(); // Prevenir el cierre automático
	closeModal(); // Usar nuestra función personalizada
});

/**
 * Abrir el modal para agregar juego
 */
function openModal() {
	isEditMode = false;
	currentEditingGame = null;
	document.querySelector(".modal-header h2").textContent = "Agregar";
	ADD_GAME_MODAL.showModal();
}

/**
 * Abrir el modal para editar juego
 * @param {Object} game - Datos del juego a editar
 */
function openEditModal(game) {
	isEditMode = true;
	currentEditingGame = game;
	document.querySelector(".modal-header h2").textContent = "Editar";

	// Llenar el formulario con los datos del juego
	fillFormWithGameData(game);

	ADD_GAME_MODAL.showModal();
}

/**
 * Llenar el formulario con los datos del juego para editar
 * @param {Object} game - Datos del juego
 */
function fillFormWithGameData(game) {
	document.getElementById("gameName").value = game.name || "";
	document.getElementById("gameGenre").value = game.genreId || "";
	document.getElementById("gamePlatform").value = game.platformId || "";
	document.getElementById("gameDate").value = game.releaseDate || "";
	document.getElementById("gameImageUrl").value = game.imageUrl || "";
	document.getElementById("gamePrice").value = game.price || "";
	document.getElementById("gameDescription").value = game.description || "";
}

/**
 * Cerrar el modal
 */
function closeModal() {
	ADD_GAME_MODAL.close();
	ADD_GAME_FORM.reset(); // Limpiar el formulario
}

/**
 * Cargar géneros en el select
 */
async function loadGenres() {
	try {
		genresData = await getGenres();
		GAME_GENRE_SELECT.innerHTML =
			'<option value="">Seleccionar género</option>';

		genresData.forEach((genre) => {
			const option = document.createElement("option");
			option.value = genre.id;
			option.textContent = genre.genero_nombre || genre.nombre || genre.genero;
			GAME_GENRE_SELECT.appendChild(option);
		});

		console.log("✅ Géneros cargados:", genresData.length);
	} catch (error) {
		console.error("❌ Error cargando géneros:", error);
		GAME_GENRE_SELECT.innerHTML =
			'<option value="">Error cargando géneros</option>';
		showError(
			"Error",
			"No se pudieron cargar los géneros. Verifica las reglas de Firestore."
		);
	}
}

/**
 * Cargar plataformas en el select
 */
async function loadPlatforms() {
	try {
		platformsData = await getPlatforms();
		GAME_PLATFORM_SELECT.innerHTML =
			'<option value="">Seleccionar plataforma</option>';

		platformsData.forEach((platform) => {
			const option = document.createElement("option");
			option.value = platform.id;
			option.textContent =
				platform.plataforma_name || platform.nombre || platform.plataforma;
			GAME_PLATFORM_SELECT.appendChild(option);
		});

		console.log("✅ Plataformas cargadas:", platformsData.length);
	} catch (error) {
		console.error("❌ Error cargando plataformas:", error);
		GAME_PLATFORM_SELECT.innerHTML =
			'<option value="">Error cargando plataformas</option>';
		showError(
			"Error",
			"No se pudieron cargar las plataformas. Verifica las reglas de Firestore."
		);
	}
}

/**
 * Cargar y mostrar juegos
 */
async function loadGames() {
	try {
		gamesData = await getGames();
		filteredGamesData = [...gamesData]; // Copia para filtrado
		displayGames(filteredGamesData);
		console.log("✅ Juegos cargados:", gamesData.length);
	} catch (error) {
		console.error("❌ Error cargando juegos:", error);
		GAMES_LIST.innerHTML =
			'<p style="text-align: center; color: red; font-size: 18px; margin-top: 50px;">Error cargando juegos</p>';
		showError(
			"Error",
			"No se pudieron cargar los juegos. Verifica las reglas de Firestore."
		);
	}
}

/**
 * Manejar la búsqueda de juegos
 * @param {Event} e - Evento del input de búsqueda
 */
function handleSearch(e) {
	const searchTerm = e.target.value.toLowerCase().trim();

	if (searchTerm === "") {
		filteredGamesData = [...gamesData];
	} else {
		filteredGamesData = gamesData.filter((game) => {
			const gameName = game.name ? game.name.toLowerCase() : "";
			const gameGenre = genresData.find((g) => g.id === game.genreId);
			const genreName = gameGenre
				? (
						gameGenre.genero_nombre ||
						gameGenre.nombre ||
						gameGenre.genero ||
						""
				  ).toLowerCase()
				: "";

			return gameName.includes(searchTerm) || genreName.includes(searchTerm);
		});
	}

	displayGames(filteredGamesData);
}

/**
 * Mostrar juegos en el DOM
 * @param {Array} games - Array de juegos a mostrar
 */
function displayGames(games) {
	GAMES_LIST.innerHTML = "";

	if (games.length === 0) {
		GAMES_LIST.innerHTML =
			'<p style="text-align: center; color: var(--foreground-accent); font-size: 18px; margin-top: 50px;">No hay juegos disponibles</p>';
		return;
	}

	games.forEach((game) => {
		const gameCard = createGameCard(game);
		GAMES_LIST.appendChild(gameCard);
	});
}

/**
 * Crear tarjeta de juego
 * @param {Object} game - Datos del juego
 * @returns {HTMLElement} Elemento de la tarjeta del juego
 */
function createGameCard(game) {
	const template = document.getElementById("game-card-template");
	const gameCard = template.content.cloneNode(true);
	// Obtener datos del género y plataforma
	const genre = genresData.find((g) => g.id === game.genreId) || {};
	const platform = platformsData.find((p) => p.id === game.platformId) || {};

	// Llenar datos de la tarjeta
	const gameImage = gameCard.querySelector(".game-image");
	const platformIcon = gameCard.querySelector(".game-image-action-btn img");
	const deleteButton = gameCard.querySelector(".delete-button");
	const gameTitle = gameCard.querySelector(".game-title");
	const gameCategory = gameCard.querySelector(".game-category");
	const gamePrice = gameCard.querySelector(".game-price");
	const gameReleaseDate = gameCard.querySelector(".game-release-date");

	gameImage.src = game.imageUrl || gameImage.src;
	gameImage.alt = `Imagen de ${game.name}`;

	// Obtener el icono de la plataforma
	const platformName =
		platform.plataforma_name || platform.nombre || platform.plataforma || "PC";
	platformIcon.src = `../public/${platformName}.svg`;
	platformIcon.alt = `Icono de ${platformName}`;

	gameTitle.textContent = game.name || "Sin nombre";
	gameCategory.textContent =
		genre.genero_nombre || genre.nombre || genre.genero || "Sin género";
	gamePrice.textContent = `$${game.price}` || "$0.00";

	// Formatear fecha
	if (game.releaseDate) {
		const date = new Date(game.releaseDate);
		gameReleaseDate.textContent = date.toLocaleDateString("es-ES");
	}

	// Agregar event listener para eliminar (con mayor prioridad)
	deleteButton.addEventListener("click", (e) => {
		e.preventDefault(); // Debug
		handleDeleteGame(game.id, game.name);
		console.log("HOLA");
		e.stopPropagation();
	});

	// También agregar al contenedor del botón por si acaso
	// const deleteButtonContainer = deleteButton.closest('.game-image-action-btn');
	// if (deleteButtonContainer) {
	// 	deleteButtonContainer.addEventListener("click", (e) => {
	// 		e.stopPropagation();
	// 		e.preventDefault();
	// 		console.log("🗑️ Contenedor del botón eliminar presionado para:", game.name); // Debug
	// 		handleDeleteGame(game.id, game.name);
	// 	});
	// }

	// Agregar event listener para editar (click en la tarjeta)
	const gameCardElement = gameCard.querySelector(".game-card");
	gameCardElement.addEventListener("click", (e) => {
		// Solo evitar abrir el modal si el clic fue en elementos relacionados con eliminar
		if (
			e.target.classList.contains("material-symbols-outlined") &&
			e.target.textContent.trim() === "delete"
		) {
			return; // Es el icono de delete, no abrir modal
		}

		if (e.target.tagName === "BUTTON" && e.target.title === "Eliminar juego") {
			return; // Es el botón de eliminar, no abrir modal
		}

		openEditModal(game);
	});

	return gameCard;
}

/**
 * Manejar envío del formulario para agregar o editar juego
 * @param {Event} e - Evento del formulario
 */
async function handleAddGame(e) {
	e.preventDefault();

	const formData = new FormData(e.target);
	const gameData = {
		name: formData.get("gameName").trim(),
		genreId: formData.get("gameGenre"),
		platformId: formData.get("gamePlatform"),
		releaseDate: formData.get("gameDate"),
		imageUrl: formData.get("gameImageUrl").trim(),
		price: formData.get("gamePrice").trim(),
		description: formData.get("gameDescription").trim(),
	};

	// Validar datos
	if (
		!gameData.name ||
		!gameData.genreId ||
		!gameData.platformId ||
		!gameData.releaseDate ||
		!gameData.imageUrl ||
		!gameData.price ||
		!gameData.description
	) {
		showError("Error", "Todos los campos son obligatorios");
		return;
	}

	try {
		if (isEditMode && currentEditingGame) {
			// Modo edición
			showLoading("Actualizando juego...", "Por favor espera");

			await updateGame(currentEditingGame.id, gameData);

			// Actualizar el juego en la lista local
			const gameIndex = gamesData.findIndex(
				(game) => game.id === currentEditingGame.id
			);
			if (gameIndex !== -1) {
				gamesData[gameIndex] = { ...gameData, id: currentEditingGame.id };
			}

			// Actualizar también la lista filtrada
			const filteredIndex = filteredGamesData.findIndex(
				(game) => game.id === currentEditingGame.id
			);
			if (filteredIndex !== -1) {
				filteredGamesData[filteredIndex] = {
					...gameData,
					id: currentEditingGame.id,
				};
			}

			displayGames(filteredGamesData);

			closeSwal();
			closeModal();
			showSuccess("¡Éxito!", "Juego actualizado correctamente");
		} else {
			// Modo agregar
			showLoading("Agregando juego...", "Por favor espera");

			const gameId = await addGame(gameData);

			// Agregar el ID al objeto del juego y actualizar la lista
			gameData.id = gameId;
			gamesData.push(gameData);
			filteredGamesData = [...gamesData]; // Actualizar lista filtrada
			displayGames(filteredGamesData);

			closeSwal();
			closeModal();
			showSuccess("¡Éxito!", "Juego agregado correctamente");
		}
	} catch (error) {
		console.error("Error procesando juego:", error);
		closeSwal();
		const action = isEditMode ? "actualizar" : "agregar";
		showError("Error", `No se pudo ${action} el juego`);
	}
}

/**
 * Manejar eliminación de juego
 * @param {string} gameId - ID del juego a eliminar
 * @param {string} gameName - Nombre del juego para mostrar en la confirmación
 */
async function handleDeleteGame(gameId, gameName) {
	try {
		const result = await showConfirmation(
			`¿Eliminar "${gameName}"?`,
			"Esta acción no se puede deshacer",
			"Sí, eliminar",
			"Cancelar"
		);

		if (result.isConfirmed) {
			showLoading("Eliminando juego...", "Por favor espera");

			await deleteGame(gameId);

			// Remover de ambas listas locales y actualizar vista
			gamesData = gamesData.filter((game) => game.id !== gameId);
			filteredGamesData = filteredGamesData.filter(
				(game) => game.id !== gameId
			);
			displayGames(filteredGamesData);

			closeSwal();
			showSuccess("¡Eliminado!", "Juego eliminado correctamente");
		}
	} catch (error) {
		console.error("Error eliminando juego:", error);
		closeSwal();
		showError("Error", "No se pudo eliminar el juego");
	}
}

// Inicializar la aplicación
async function initApp() {
	try {
		// Cargar datos secuencialmente para evitar sobrecarga
		showLoading("Cargando juegos...", "Por favor espera");
		try {
			await loadGenres();
			await loadPlatforms();
			await loadGames();
		} catch (dataError) {
			console.error("❌ Error cargando datos:", dataError);
			throw dataError;
		}

		closeSwal();
		console.log("🎉 Aplicación inicializada correctamente");
	} catch (error) {
		console.error("❌ Error inicializando la aplicación:", error);
		closeSwal();
		showError("Error", "Error al inicializar la aplicación: " + error.message);
	}
}
