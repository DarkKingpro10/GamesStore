# GamesStore

Aplicación de tienda de juegos para Web y Desktop (Electron) con autenticación Firebase.

## 🚀 Características

- ✅ Autenticación con Firebase (registro/login)
- ✅ Validación con Zod
- ✅ Interfaz responsive
- ✅ Compatible con Web y Electron

## 📋 Requisitos
- Node.js 18+
- Cuenta de Firebase

## ⚙️ Setup rápido

### 1. Instalar dependencias
```cmd
npm install
```

### 2. Configurar Firebase
```cmd
# Copiar template
copy .env.example .env.local

# Editar .env.local con tus credenciales de Firebase Console
```

### 3. Ejecutar
```cmd
# Web
npm run dev

# Desktop (Electron)
npm run dev:desktop
```

## 🔧 Configuración de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea un proyecto nuevo
3. Habilita **Authentication** > **Email/Password**
4. Copia las credenciales a `.env.local`

## � Uso

- **Registro**: Crea una cuenta nueva
- **Login**: Inicia sesión con tu cuenta
- **Validación**: Campos con validación automática

El HTML principal (`src/index.html`) importa `styles.css` e `index.js` para que los estilos apliquen en la página. Si agregas más páginas HTML, incluye la misma línea:
```html
<link rel="stylesheet" href="./styles.css" />
```
## Crear los ejecutables
```
npm run build:desktop
```

## Estructura
- `electron/main.js`: proceso principal de Electron y menú.
- `src/index.html`: página raíz compartida.
- `src/styles.css`: estilos compartidos.
- `src/index.js`: script simple que detecta entorno.

## Notas
- La integración de Node está desactivada en el Renderer por seguridad. Usa preload si necesitas exponer APIs.
- En macOS, la opción Cerrar ventana corresponde al rol nativo.
