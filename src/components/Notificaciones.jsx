import { useState } from 'react'

function Notificaciones() {
  const [permiso, setPermiso] = useState(
    'Notification' in window ? Notification.permission : 'no-soportado'
  )

  async function activar() {
    const resultado = await Notification.requestPermission()
    setPermiso(resultado)
  }

  if (permiso === 'no-soportado') {
    return <p className="aviso">Tu navegador no admite notificaciones.</p>
  }
  if (permiso === 'granted') {
    return <p className="aviso">Avisos activados</p>
  }
  if (permiso === 'denied') {
    return (
      <p className="aviso">
        Avisos bloqueados. Puedes permitirlos desde los permisos del sitio en tu navegador.
      </p>
    )
  }
  return (
    <button className="aviso-boton" onClick={activar}>
      Activar avisos
    </button>
  )
}

export default Notificaciones