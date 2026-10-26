import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Notificaciones from './components/Notificaciones'
import Resumen from './components/Resumen'
import Filtros from './components/Filtros'
import Calendario from './components/Calendario'
import Lista from './components/Lista'
import ModalTarea from './components/ModalTarea'
import { coincideConFiltro, asignaturaPorDefecto } from './data/asignaturas'
import { useRecordatorios } from './hooks/useRecordatorios'
import { useAhora } from './hooks/useAhora'
import { aISO } from './utils/fechas'

function App() {
  const [asignaturaActiva, setAsignaturaActiva] = useState(null)
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [ocultarHechos, setOcultarHechos] = useState(false)
  const [vista, setVista] = useState('calendario')
  const [modal, setModal] = useState(null)
  const [elementos, setElementos] = useState(() => {
    try {
      const guardado = localStorage.getItem('agenda-elementos')
      return guardado ? JSON.parse(guardado) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('agenda-elementos', JSON.stringify(elementos))
  }, [elementos])

  useRecordatorios(elementos, setElementos)
  useAhora()

  function abrirNuevo(fecha) {
    setModal({ modo: 'nuevo', fecha })
  }

  function abrirEdicion(elemento) {
    setModal({ modo: 'editar', elemento })
  }

  function cerrarModal() {
    setModal(null)
  }

  function anadirElemento(datos) {
    const nuevo = { ...datos, id: Date.now(), hecho: false, avisado: false }
    setElementos([...elementos, nuevo])
    cerrarModal()
  }

  function guardarEdicion(datos) {
    setElementos(
      elementos.map((e) =>
        e.id === modal.elemento.id ? { ...e, ...datos, avisado: false } : e
      )
    )
    cerrarModal()
  }

  function alternarHecho(id) {
    setElementos(
      elementos.map((e) => (e.id === id ? { ...e, hecho: !e.hecho } : e))
    )
  }

  function borrarElemento(id) {
    setElementos(elementos.filter((e) => e.id !== id))
    cerrarModal()
  }

  const visibles = elementos.filter(
    (e) =>
      coincideConFiltro(e.asignatura, asignaturaActiva) &&
      (filtroTipo === 'todos' || e.tipo === filtroTipo) &&
      !(ocultarHechos && e.hecho)
  )

  return (
    <>
      <Navbar onSelect={setAsignaturaActiva} activa={asignaturaActiva} />
      <main className="contenido">
        <Notificaciones />
        <h2>{asignaturaActiva ?? 'Todo'}</h2>
        <Resumen elementos={visibles} />
        <Filtros
          tipo={filtroTipo}
          onTipo={setFiltroTipo}
          ocultarHechos={ocultarHechos}
          onOcultarHechos={setOcultarHechos}
        />

        <div className="barra-vistas">
          <div className="filtros-tipo">
            <button
              className={vista === 'calendario' ? 'activo' : ''}
              onClick={() => setVista('calendario')}
            >
              Calendario
            </button>
            <button
              className={vista === 'lista' ? 'activo' : ''}
              onClick={() => setVista('lista')}
            >
              Lista
            </button>
          </div>
          <button
            className="boton-nuevo"
            onClick={() => abrirNuevo(aISO(new Date()))}
          >
            + Nueva tarea
          </button>
        </div>

        {vista === 'calendario' ? (
          <Calendario
            elementos={visibles}
            onDia={abrirNuevo}
            onElemento={abrirEdicion}
          />
        ) : (
          <Lista
            elementos={visibles}
            onAlternar={alternarHecho}
            onBorrar={borrarElemento}
            onEditar={abrirEdicion}
          />
        )}
      </main>

      {modal && (
        <ModalTarea
          modal={modal}
          asignaturaInicial={asignaturaPorDefecto(asignaturaActiva)}
          onAnadir={anadirElemento}
          onGuardar={guardarEdicion}
          onAlternar={alternarHecho}
          onBorrar={borrarElemento}
          onCerrar={cerrarModal}
        />
      )}
    </>
  )
}

export default App