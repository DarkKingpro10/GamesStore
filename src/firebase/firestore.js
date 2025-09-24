// Funciones para interactuar con Firestore
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import {db} from  "./config.js";


/**
 * Obtener todos los géneros desde Firebase
 * @returns {Promise<Array>} Array de géneros
 */
export async function getGenres() {
  try {
    const querySnapshot = await getDocs(collection(db, "generos"));
    const genres = [];
    querySnapshot.forEach((doc) => {
      genres.push({
        id: doc.id,
        ...doc.data()
      });
    });
    // console.log("✅ Géneros obtenidos:", genres.length);
    return genres;
  } catch (error) {
    console.error("❌ Error obteniendo géneros:", error);
    console.error("Código:", error.code, "Mensaje:", error.message);
    throw error;
  }
}

/**
 * Obtener todas las plataformas desde Firebase
 * @returns {Promise<Array>} Array de plataformas
 */
export async function getPlatforms() {
  try {
    console.log("🔍 Obteniendo plataformas...");
    const querySnapshot = await getDocs(collection(db, "plataformas"));
    const platforms = [];
    querySnapshot.forEach((doc) => {
      platforms.push({
        id: doc.id,
        ...doc.data()
      });
    });
    console.log("✅ Plataformas obtenidas:", platforms.length);
    return platforms;
  } catch (error) {
    console.error("❌ Error obteniendo plataformas:", error);
    console.error("Código:", error.code, "Mensaje:", error.message);
    throw error;
  }
}

/**
 * Obtener todos los juegos desde Firebase
 * @returns {Promise<Array>} Array de juegos
 */
export async function getGames() {
  try {
    console.log("🔍 Obteniendo juegos...");
    const querySnapshot = await getDocs(collection(db, "juegos"));
    const games = [];
    querySnapshot.forEach((doc) => {
      games.push({
        id: doc.id,
        ...doc.data()
      });
    });
    console.log("✅ Juegos obtenidos:", games.length);
    return games;
  } catch (error) {
    console.error("❌ Error obteniendo juegos:", error);
    console.error("Código:", error.code, "Mensaje:", error.message);
    throw error;
  }
}

/**
 * Agregar un nuevo juego a Firebase
 * @param {Object} gameData - Datos del juego
 * @returns {Promise<string>} ID del documento creado
 */
export async function addGame(gameData) {
  try {
    const docRef = await addDoc(collection(db, "juegos"), {
      ...gameData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error agregando juego:", error);
    throw error;
  }
}

/**
 * Eliminar un juego de Firebase
 * @param {string} gameId - ID del juego a eliminar
 * @returns {Promise<void>}
 */
export async function deleteGame(gameId) {
  try {
    await deleteDoc(doc(db, "juegos", gameId));
  } catch (error) {
    console.error("Error eliminando juego:", error);
    throw error;
  }
}

/**
 * Actualizar un juego en Firebase
 * @param {string} gameId - ID del juego a actualizar
 * @param {Object} gameData - Datos del juego actualizados
 * @returns {Promise<void>}
 */
export async function updateGame(gameId, gameData) {
  throw new Error("Función deshabilitada para pruebas");
  try {
    await updateDoc(doc(db, "juegos", gameId), {
      ...gameData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error actualizando juego:", error);
    throw error;
  }
}

// Exportar la instancia de Firestore para uso directo si es necesario
export { db };