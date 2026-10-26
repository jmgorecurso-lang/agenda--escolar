export function obtenerFechaLimite(elemento) {
    const hora = elemento.hora || '23:59'
    return new Date (`${elemento.fecha}T${hora}`)
}

export function calcularUrgencia(elemento) {
    const horasRestantes = (obtenerFechaLimite (elemento) - new Date()) / (1000 * 60 *60)
    // Restar dos fechas en JavaScript da la diferencia en milisegundos. Por eso se divide entre 1000 * 60 * 60 para pasarlo a horas.

    if (horasRestantes < 0) return 'vencido'
    if (horasRestantes <= 24) return 'urgente'
    if (horasRestantes <= 24 * 7) return 'semana'
    return 'futuro'
}
export function aISO(fecha) {
  const dos = (n) => String(n).padStart(2, '0')
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}`
}

export function diasDelMes(anio, mes) {
  const primero = new Date(anio, mes, 1)
  const desfase = (primero.getDay() + 6) % 7 // para que la semana empiece en lunes
  return Array.from(
    { length: 42 },
    (_, i) => new Date(anio, mes, 1 - desfase + i)
  )
}