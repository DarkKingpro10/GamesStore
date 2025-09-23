// Servicios de autenticación con Firebase
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from './config.js';

/**
 * Registrar un nuevo usuario con email y contraseña
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @param {string} displayName - Nombre del usuario (opcional)
 * @returns {Promise<Object>} - Resultado de la operación
 */
export async function registerUser(email, password, displayName = '') {
  try {    
    // Crear usuario con email y contraseña
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Actualizar el perfil con el nombre si se proporciona
    if (displayName) {
      await updateProfile(user, {
        displayName: displayName
      });
    }
    
    console.log('Usuario registrado exitosamente:', user.uid);
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      },
      message: 'Usuario registrado exitosamente'
    };
    
  } catch (error) {    
    let errorMessage = 'Error al registrar usuario';
    
    // Personalizar mensajes de error
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Este email ya está registrado';
        break;
      case 'auth/weak-password':
        errorMessage = 'La contraseña debe tener al menos 6 caracteres';
        break;
      case 'auth/invalid-email':
        errorMessage = 'El email no es válido';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'El registro con email/contraseña no está habilitado';
        break;
      default:
        errorMessage = error.message;
    }
    
    return {
      success: false,
      error: error.code,
      message: errorMessage
    };
  }
}

/**
 * Iniciar sesión con email y contraseña
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<Object>} - Resultado de la operación
 */
export async function loginUser(email, password) {
  try {    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ Sesión iniciada exitosamente:', user.uid);
    
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      },
      message: 'Sesión iniciada exitosamente'
    };
    
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    
    let errorMessage = 'Error al iniciar sesión';
    
    // Personalizar mensajes de error
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No existe una cuenta con este email';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Esta cuenta ha sido deshabilitada';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
        break;
      case "auth/invalid-credential":
        errorMessage = "Credenciales inválidas. Por favor verifica tus datos.";
        break;
      default:
        errorMessage = error.message;
    }
    
    return {
      success: false,
      error: error.code,
      message: errorMessage
    };
  }
}

/**
 * Cerrar sesión del usuario actual
 * @returns {Promise<Object>} - Resultado de la operación
 */
export async function logoutUser() {
  try {
    await signOut(auth);
    console.log('✅ Sesión cerrada exitosamente');
    
    return {
      success: true,
      message: 'Sesión cerrada exitosamente'
    };
    
  } catch (error) {
    console.error('❌ Error al cerrar sesión:', error);
    
    return {
      success: false,
      error: error.code,
      message: 'Error al cerrar sesión'
    };
  }
}

/**
 * Observar cambios en el estado de autenticación
 * @param {Function} callback - Función que se ejecuta cuando cambia el estado
 * @returns {Function} - Función para desuscribirse del observer
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Obtener el usuario actual
 * @returns {Object|null} - Usuario actual o null si no está autenticado
 */
export function getCurrentUser() {
  return auth.currentUser;
}