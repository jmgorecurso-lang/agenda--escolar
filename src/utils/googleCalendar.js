import { eventoGoogle } from './calendario'

const BASE = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'

async function llamar(token, url, opciones = {}) {
  const respuesta = await fetch(url, {
    ...opciones,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!respuesta.ok) {
    const error = new Error(`Google Calendar respondió ${respuesta.status}`)
    error.status = respuesta.status
    throw error
  }

  return respuesta.status === 204 ? null : respuesta.json()
}

export async function crearEvento(token, elemento) {
  const datos = await llamar(token, BASE, {
    method: 'POST',
    body: JSON.stringify(eventoGoogle(elemento)),
  })
  return datos.id
}

export async function actualizarEvento(token, eventId, elemento) {
  await llamar(token, `${BASE}/${eventId}`, {
    method: 'PATCH',
    body: JSON.stringify(eventoGoogle(elemento)),
  })
}

export async function borrarEvento(token, eventId) {
  try {
    await llamar(token, `${BASE}/${eventId}`, { method: 'DELETE' })
  } catch (error) {
    // Si el evento ya no existe en Calendar, no hay nada que borrar
    if (error.status !== 404 && error.status !== 410) throw error
  }
}