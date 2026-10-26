import { useState } from 'react'
import '../styles/calendario.css'
import {
  diasDelMes,
  aISO,
  calcularUrgencia,
  obtenerFechaLimite,
} from '../utils/fechas'
import { asignaturas, colorDeAsignatura } from '../data/asignaturas'

const nombresDias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const MAX_POR_DIA = 5

function primeroDeEsteMes() {
  const hoy = new Date()
  return new Date(hoy.getFullYear(), hoy.getMonth(), 1)
}

function Calendario({ elementos, onDia, onElemento }) {
  const [mes, setMes] = useState(primeroDeEsteMes)

  const dias = diasDelMes(mes.getFullYear(), mes.getMonth())
  const hoyISO = aISO(new Date())

  // Agrupamos las tareas por día, ya ordenadas por hora
  const porDia = {}
    ;[...elementos]
      .sort((a, b) => obtenerFechaLimite(a) - obtenerFechaLimite(b))
      .forEach((e) => {
        if (!porDia[e.fecha]) porDia[e.fecha] = []
        porDia[e.fecha].push(e)
      })

  function cambiarMes(cantidad) {
    setMes(new Date(mes.getFullYear(), mes.getMonth() + cantidad, 1))
  }

  const titulo = mes.toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="calendario">
      <div className="calendario-cabecera">
        <button onClick={() => cambiarMes(-1)}>‹</button>
        <span className="calendario-titulo">{titulo}</span>
        <button onClick={() => cambiarMes(1)}>›</button>
        <button onClick={() => setMes(primeroDeEsteMes())}>Hoy</button>
      </div>

      <div className="calendario-rejilla">
        {nombresDias.map((d) => (
          <div key={d} className="calendario-dia-nombre">
            {d}
          </div>
        ))}

        {dias.map((dia) => {
          const iso = aISO(dia)
          const delMes = dia.getMonth() === mes.getMonth()
          const tareas = porDia[iso] ?? []

          return (
            <div
              key={iso}
              className={`calendario-celda${delMes ? '' : ' otro-mes'}${iso === hoyISO ? ' hoy' : ''
                }`}
              onClick={() => onDia(iso)}
            >
              <span className="calendario-numero">{dia.getDate()}</span>

              {tareas.slice(0, MAX_POR_DIA).map((e) => (
                <button
                  key={e.id}
                  className={`chip ${e.tipo} ${e.hecho ? 'hecho' : calcularUrgencia(e)}`}
                  style={{ '--asig': colorDeAsignatura(e.asignatura) }}
                  title={`${e.titulo} · ${e.asignatura}`}
                  onClick={(ev) => {
                    ev.stopPropagation()
                    onElemento(e)
                  }}
                >
                  {e.titulo}
                </button>
              ))}

              {tareas.length > MAX_POR_DIA && (
                <span className="calendario-mas">
                  +{tareas.length - MAX_POR_DIA} más
                </span>
              )}
            </div>
          )
        })}
      </div>
      <ul className="leyenda">
  {asignaturas.map((a) => (
    <li key={a.nombre}>
      <span className="leyenda-punto" style={{ background: a.color }} />
      {a.nombre}
    </li>
  ))}
</ul>
    </div>
    
  )
}

export default Calendario