import { useState } from 'react'
import { listaPlana } from '../data/asignaturas'

const formularioVacio = {
    titulo: '',
    asignatura: listaPlana[0],
    tipo: 'tarea',
    fecha: '',
    hora: '',
    recordatorio: '1440',
    notas: '',
}

function Formulario({ inicial, fechaInicial, asignaturaInicial, onAnadir, onGuardar, onCancelar }) {
  const vacio = { ...formularioVacio, asignatura: asignaturaInicial,  fecha: fechaInicial ?? '', }
  const [datos, setDatos] = useState({ ...vacio, ...inicial })
  const editando = Boolean(inicial)

    function manejarCambio(e) {
        const { name, value } = e.target
        setDatos({ ...datos, [name]: value })
    }

    function manejarEnvio(e) {
        e.preventDefault()
        if (!datos.titulo || !datos.fecha) return

        if (editando) {
            onGuardar(datos)
        } else {
            onAnadir(datos)
           
        }
    }

    return (
        <form className="formulario" onSubmit={manejarEnvio}>
            <input
                type="text"
                name="titulo"
                placeholder="Título (ej: Ejercicios tema 3)"
                value={datos.titulo}
                onChange={manejarCambio}
                autoFocus
            />

            <select name="tipo" value={datos.tipo} onChange={manejarCambio}>
                <option value="tarea">Tarea</option>
                <option value="examen">Examen</option>
            </select>

            <select name="asignatura" value={datos.asignatura} onChange={manejarCambio}>
                {listaPlana.map((a) => (
                    <option key={a} value={a}>{a}</option>
                ))}
            </select>

            <input type="date" name="fecha" value={datos.fecha} onChange={manejarCambio} />
            <input type="time" name="hora" value={datos.hora} onChange={manejarCambio} />
             {/* Los valores son minutos (1440 = 24h), que es el formato para hacer las cuentas luego */}
            <select name="recordatorio" value={datos.recordatorio} onChange={manejarCambio}>
                <option value="ninguno">Sin recordatorio</option>
                <option value="60">Avisar 1 hora antes</option>
                <option value="180">Avisar 3 horas antes</option>
                <option value="1440">Avisar 1 día antes</option>
                <option value="4320">Avisar 3 días antes</option>
            </select>

            <textarea
                name="notas"
                placeholder="Notas (opcional)"
                value={datos.notas}
                onChange={manejarCambio}
            />

            <button id="anadir" type="submit">{editando ? 'Guardar cambios' : 'Añadir'}</button>
            {editando && (
                <button type="button" onClick={onCancelar}>Cancelar</button>
            )}
        </form>
    )
}

export default Formulario