export const asignaturas = [
  { nombre: 'Lengua', color:'DodgerBlue',subasignaturas: ['Inglés', 'Castellano', 'Catalán', 'Francés'] },
  { nombre: 'Matemáticas',color:'aquamarine' },
  { nombre: 'Biología' ,color:'YellowGreen'},
  { nombre: 'Geografía',color:'IndianRed' },
  { nombre: 'Sociales' ,color:'Violet'},
  { nombre: 'Plástica' ,color: 'Azure'},
  { nombre: 'Tecnología', color:'Silver' },
  { nombre: 'Música' ,color:'black'},
]
export const listaPlana = asignaturas.flatMap((a) => a.subasignaturas ?? [a.nombre])

export function coincideConFiltro(asignatura, filtro) {
  if (!filtro) return true
  if (asignatura === filtro) return true

  const grupo = asignaturas.find((a) => a.nombre === filtro)
  return grupo?.subasignaturas?.includes(asignatura) ?? false
}
export function asignaturaPorDefecto(filtro) {
  if (!filtro) return listaPlana[0]
  if (listaPlana.includes(filtro)) return filtro

  const grupo = asignaturas.find((a) => a.nombre === filtro)
  return grupo?.subasignaturas?.[0] ?? listaPlana[0]
}
export function colorDeAsignatura(nombre) {
  const directa = asignaturas.find((a) => a.nombre === nombre)
  if (directa?.color) return directa.color

  const grupo = asignaturas.find((a) => a.subasignaturas?.includes(nombre))
  return grupo?.color ?? 'lightgray'
}