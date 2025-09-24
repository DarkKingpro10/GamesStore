// Configuración de Firebase usando variables de entorno
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Validar que todas las variables de entorno estén definidas
const requiredEnvVars = [
	"VITE_FIREBASE_API_KEY",
	"VITE_FIREBASE_AUTH_DOMAIN",
	"VITE_FIREBASE_PROJECT_ID",
	"VITE_FIREBASE_STORAGE_BUCKET",
	"VITE_FIREBASE_MESSAGING_SENDER_ID",
	"VITE_FIREBASE_APP_ID",
];

const missingVars = requiredEnvVars.filter(
	(varName) => !import.meta.env[varName]
);

if (missingVars.length > 0) {
  console.error("❌ Variables de entorno faltantes para Firebase:", missingVars);
	throw new Error(
		`Faltan variables de entorno necesarias para Firebase: ${missingVars.join(
			", "
		)}`
	);
}

let app;

// Configuración de Firebase desde variables de entorno
const firebaseConfig = {
  apiKey: "AIzaSyB3TC-JgnjmRO6voTt-R8Xdpv-DnPaiTN8",
  authDomain: "gamesstore-3ba6a.firebaseapp.com",
  projectId: "gamesstore-3ba6a",
  storageBucket: "gamesstore-3ba6a.firebasestorage.app",
  messagingSenderId: "426729169036",
  appId: "1:426729169036:web:7654cdcdba1aa22806dba9"
};

console.log(
	"🔥 Configurando Firebase para proyecto:",
	firebaseConfig.projectId
);

// Inicializar Firebase
app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

// Inicializar Firebase Authentication y exportar
export const auth = getAuth(app);
// Exportar la instancia de Firebase como default (solo una vez)
export default app;
