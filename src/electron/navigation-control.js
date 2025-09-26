// Control de navegación para Electron
// Previene uso de botones atrás/adelante

/**
 * Deshabilitar navegación del historial en Electron
 */
export function disableHistoryNavigation() {
  // Solo aplicar en Electron
  if (!window.app?.env?.isElectron) {
    return;
  }

  console.log('🚫 Deshabilitando navegación de historial en Electron');

  // Interceptar eventos de navegación
  window.addEventListener('popstate', (event) => {
    // Prevenir navegación atrás/adelante
    event.preventDefault();
    event.stopPropagation();
    
    console.log('🚫 Navegación de historial bloqueada');
    
    // Mantener la página actual
    history.pushState(null, '', window.location.href);
  });

  // Reemplazar el historial inicial
  history.replaceState(null, '', window.location.href);
  
  // Deshabilitar gestos de navegación si es posible
  document.addEventListener('keydown', (event) => {
    // Bloquear Alt+Left y Alt+Right
    if (event.altKey && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault();
      console.log('🚫 Atajo de navegación bloqueado');
    }
    
    // Bloquear Backspace para navegación (opcional)
    if (event.key === 'Backspace' && !['INPUT', 'TEXTAREA'].includes(event.target.tagName)) {
      event.preventDefault();
      console.log('🚫 Navegación con Backspace bloqueada');
    }
  });
}

/**
 * Limpiar historial de navegación
 */
export function clearNavigationHistory() {
  if (window.app?.env?.isElectron) {
    // Limpiar historial
    history.replaceState(null, '', window.location.href);
    console.log('🧹 Historial de navegación limpiado');
  }
}

export default disableHistoryNavigation;