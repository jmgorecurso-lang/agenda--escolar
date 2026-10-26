import { calcularUrgencia } from '../utils/fechas'

function plural(n, singular, pluralTexto) {
  return `${n} ${n === 1 ? singular : pluralTexto}`
}

function Resumen({ elementos }) {
  const pendientes = elementos.filter((e) => !e.hecho)

  if (pendientes.length === 0) {
    return <div className="resumen">Todo al día</div>
  }

  const vencidos = pendientes.filter((e) => calcularUrgencia(e) === 'vencido').length
  const urgentes = pendientes.filter((e) => calcularUrgencia(e) === 'urgente').length

  return (
    <div className="resumen">
      <span className="resumen-total">
        {plural(pendientes.length, 'pendiente', 'pendientes')}
      </span>

      {vencidos > 0 && (
        <span className="resumen-chip vencido">
          {plural(vencidos, 'vencido', 'vencidos')}
        </span>
      )}

      {urgentes > 0 && (
        <span className="resumen-chip urgente">
          {urgentes} en menos de 24 h
        </span>
      )}
    </div>
  )
}

export default Resumen