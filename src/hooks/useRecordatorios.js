import { useEffect } from 'react'
import { obtenerFechaLimite } from '../utils/fechas'

export function useRecordatorios(elementos, setElementos) {
  useEffect(() => {
    function revisar() {
      if (!('Notification' in window) || Notification.permission !== 'granted') return

      const ahora = new Date()

      const toca = elementos.filter((e) => {
        if (e.hecho || e.avisado) return false
        if (!e.recordatorio || e.recordatorio === 'ninguno') return false

        const limite = obtenerFechaLimite(e)
        const momentoAviso = new Date(
          limite.getTime() - Number(e.recordatorio) * 60 * 1000
        )
        return ahora >= momentoAviso && ahora < limite
      })

      if (toca.length === 0) return

      toca.forEach((e) => {
        const limite = obtenerFechaLimite(e)
        new Notification(
          `${e.tipo === 'examen' ? 'Examen' : 'Tarea'}: ${e.titulo}`,
          {
            body: `${e.asignatura} · ${limite.toLocaleString('es-ES', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              hour: '2-digit',
              minute: '2-digit',
            })}`,
          }
        )
      })

      const ids = toca.map((e) => e.id)
      setElementos((prev) =>
        prev.map((e) => (ids.includes(e.id) ? { ...e, avisado: true } : e))
      )
    }

    revisar()
    const intervalo = setInterval(revisar, 60 * 1000)
    return () => clearInterval(intervalo)
  }, [elementos, setElementos])
}