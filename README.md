# GamesStore

Aplicación base para Web y Desktop (Electron) con un menú de ventana para minimizar, maximizar/restaurar y cerrar.

## Requisitos
- Node.js 18+

## Instalación
```cmd
npm install
```

## Ejecutar en Desktop (Electron)
```cmd
npm run dev:desktop
```
Se abrirá una ventana con menú (Archivo, Ventana, Ver). En "Ventana" encontrarás:
- Minimizar
- Maximizar/Restaurar (Ctrl+M)
- Cerrar ventana

## Ejecutar en Web
```cmd
npm run dev:web
```
Luego abre en el navegador: http://localhost:5173

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
