import { obtenerFechaLimite, aISO } from './fechas'

const dos = (n) => String(n).padStart(2, '0')

function formatoFecha(fecha) {
  return `${fecha.getFullYear()}${dos(fecha.getMonth() + 1)}${dos(fecha.getDate())}`
}

function formatoFechaHora(fecha) {
  return `${formatoFecha(fecha)}T${dos(fecha.getHours())}${dos(fecha.getMinutes())}00`
}

export function enlaceGoogleCalendar(elemento) {
  let fechas

  if (elemento.hora) {
    // Con hora: evento de una hora que empieza a la hora indicada
    const inicio = obtenerFechaLimite(elemento)
    const fin = new Date(inicio.getTime() + 60 * 60 * 1000)
    fechas = `${formatoFechaHora(inicio)}/${formatoFechaHora(fin)}`
  } else {
    // Sin hora: evento de todo el día
    const inicio = new Date(`${elemento.fecha}T00:00`)
    const fin = new Date(inicio)
    fin.setDate(fin.getDate() + 1)
    fechas = `${formatoFecha(inicio)}/${formatoFecha(fin)}`
  }

  const tipo = elemento.tipo === 'examen' ? 'Examen' : 'Tarea'

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${tipo}: ${elemento.titulo} (${elemento.asignatura})`,
    dates: fechas,
    details: elemento.notas || '',
    ctz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
function isoLocal(fecha) {
  return `${aISO(fecha)}T${dos(fecha.getHours())}:${dos(fecha.getMinutes())}:00`
}

export function eventoGoogle(elemento) {
  const zona = Intl.DateTimeFormat().resolvedOptions().timeZone
  const tipo = elemento.tipo === 'examen' ? 'Examen' : 'Tarea'
  let start
  let end

  if (elemento.hora) {
    const inicio = obtenerFechaLimite(elemento)
    const fin = new Date(inicio.getTime() + 60 * 60 * 1000)
    start = { dateTime: isoLocal(inicio), timeZone: zona }
    end = { dateTime: isoLocal(fin), timeZone: zona }
  } else {
    const siguiente = new Date(`${elemento.fecha}T00:00`)
    siguiente.setDate(siguiente.getDate() + 1)
    start = { date: elemento.fecha }
    end = { date: aISO(siguiente) }
  }

  const minutos = Number(elemento.recordatorio)
  const reminders = Number.isFinite(minutos)
    ? { useDefault: false, overrides: [{ method: 'popup', minutes: minutos }] }
    : { useDefault: false }

  return {
    summary: `${tipo}: ${elemento.titulo} (${elemento.asignatura})`,
    description: elemento.notas || '',
    start,
    end,
    reminders,
  }
}