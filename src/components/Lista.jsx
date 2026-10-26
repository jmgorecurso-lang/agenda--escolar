import Tarjeta from './Tarjeta'
import { obtenerFechaLimite } from '../utils/fechas'

function Lista({ elementos, onAlternar, onBorrar, onEditar }) {
  if (elementos.length === 0) {
    return <p>No hay nada que mostrar aquí todavía.</p>
  }

  const ordenados = [...elementos].sort((a, b) => {
    if (a.hecho !== b.hecho) return a.hecho - b.hecho
    return obtenerFechaLimite(a) - obtenerFechaLimite(b)
  })

  return (
    <ul className="lista">
      {ordenados.map((e) => (
        <Tarjeta
          key={e.id}
          elemento={e}
          onAlternar={onAlternar}
          onBorrar={onBorrar}
           onEditar={onEditar}
        />
      ))}
    </ul>
  )
}

export default Lista