import { enlaceGoogleCalendar } from "../utils/calendario";
import { calcularUrgencia, obtenerFechaLimite } from "../utils/fechas";
const etiquetas = {
    vencido: 'vencido',
    urgente: 'Menos de 24 horas',
    semana: 'Esta semana',
    futuro: 'Más adelante',
    hecho: 'Completado',
}

function Tarjeta({ elemento, onAlternar, onBorrar, onEditar }) {
    const urgencia = elemento.hecho ? 'hecho' : calcularUrgencia(elemento)
    const limite = obtenerFechaLimite(elemento)

    const fechaTexto = limite.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    })
    function confirmarBorrado() {
        if (window.confirm(`¿Borrar "${elemento.titulo}"?`)) {
            onBorrar(elemento.id)
        }
    }

    return (
        <li className={`tarjeta ${elemento.tipo} ${urgencia}`}>
            <div className="tarjeta-cabecera">
                <span className="tarjeta-tipo">
                    {elemento.tipo === 'examen' ? 'Examen' : 'Tarea'}
                </span>
                <span className="tarjeta-urgencia">{etiquetas[urgencia]}</span>
            </div>

            <h3>{elemento.titulo}</h3>
            <p>{elemento.asignatura}</p>
            <p>
                {fechaTexto}
                {elemento.hora && ` · ${elemento.hora}`}
            </p>

            {elemento.notas && <p className="tarjeta-notas">{elemento.notas}</p>}
            <div className="tarjeta-acciones">
                <button onClick={() => onAlternar(elemento.id)}>
                    {elemento.hecho ? 'Deshacer' : 'Hecho'}
                </button>
                <button onClick={() => onEditar(elemento)}>Editar</button>
                <button onClick={confirmarBorrado}>Borrar</button>
            </div>
            <div className="tarjeta-acciones">
                <button onClick={() => onAlternar(elemento.id)}>
                    {elemento.hecho ? 'Deshacer' : 'Hecho'}
                </button>
                <button onClick={() => onEditar(elemento)}>Editar</button>
                <button className="borrar" onClick={confirmarBorrado}>Borrar</button>
                {!elemento.hecho && (
                    <a
                        href={enlaceGoogleCalendar(elemento)}
                        target="_blank"
                        rel="noreferrer"
                    >
                        + Calendar
                    </a>
                )}
            </div>
        </li>


    )
}

export default Tarjeta