import { registerSW } from 'virtual:pwa-register'

export function registerServiceWorker(): void {
  registerSW({
    immediate: true,
    onOfflineReady() {
      console.info('La aplicación base quedó disponible para uso offline.')
    },
    onNeedRefresh() {
      console.info('Hay una nueva versión disponible para actualizar.')
    },
    onRegisterError(error) {
      console.error('No se pudo registrar el service worker.', error)
    },
  })
}
