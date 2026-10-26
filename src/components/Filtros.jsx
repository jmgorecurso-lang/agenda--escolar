const opciones = [
  { valor: 'todos', texto: 'Todo' },
  { valor: 'tarea', texto: 'Tareas' },
  { valor: 'examen', texto: 'Exámenes' },
]

function Filtros({ tipo, onTipo, ocultarHechos, onOcultarHechos }) {
  return (
    <div className="filtros">
      <div className="filtros-tipo">
        {opciones.map((o) => (
          <button
            key={o.valor}
            className={tipo === o.valor ? 'activo' : ''}
            onClick={() => onTipo(o.valor)}
          >
            {o.texto}
          </button>
        ))}
      </div>

      <label className="filtros-ocultar">
        <input
          type="checkbox"
          checked={ocultarHechos}
          onChange={(e) => onOcultarHechos(e.target.checked)}
        />
        Ocultar completados
      </label>
    </div>
  )
}

export default Filtros