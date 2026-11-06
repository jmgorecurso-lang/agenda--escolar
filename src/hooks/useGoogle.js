import { useState, useRef } from 'react'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const CALENDAR = 'https://www.googleapis.com/auth/calendar.events'
const PERMISOS = `openid profile email ${CALENDAR}`

export function useGoogle() {
  const [usuario, setUsuario] = useState(null)
  const [error, setError] = useState('')
  const clienteRef = useRef(null)

  function iniciarSesion() {
    setError('')

    if (!CLIENT_ID) {
      setError('Falta VITE_GOOGLE_CLIENT_ID en el archivo .env')
      return
    }
    if (!window.google?.accounts?.oauth2) {
      setError('No se pudo cargar el servicio de Google.')
      return
    }

    if (!clienteRef.current) {
      clienteRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: PERMISOS,
        callback: async (respuesta) => {
          if (respuesta.error) {
            setError('No se completó el inicio de sesión.')
            return
          }
          try {
            const r = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${respuesta.access_token}` },
            })
            const datos = await r.json()
            setUsuario({
              nombre: datos.name,
              foto: datos.picture,
              email: datos.email,
              token: respuesta.access_token,
              calendario: window.google.accounts.oauth2.hasGrantedAllScopes(
                respuesta,
                CALENDAR
              ),
            })
          } catch {
            setError('No se pudieron leer los datos de tu cuenta.')
          }
        },
      })
    }

    clienteRef.current.requestAccessToken()
  }

  function cerrarSesion() {
    setUsuario(null)
  }

  return { usuario, error, iniciarSesion, cerrarSesion }
}