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
import CuentaGoogle from './components/CuentaGoogle'
import { useGoogle } from './hooks/useGoogle'
import { crearEvento, actualizarEvento, borrarEvento } from './utils/googleCalendar'

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
  const { usuario, error, iniciarSesion, cerrarSesion } = useGoogle()
  const [avisoSync, setAvisoSync] = useState('')

  const puedeSincronizar = Boolean(usuario?.token && usuario.calendario)

  function manejarErrorGoogle(error) {
    if (error.status === 401) {
      cerrarSesion()
      setAvisoSync('Tu sesión de Google ha caducado. Inicia sesión de nuevo para sincronizar con Calendar.')
    } else {
      setAvisoSync('No se pudo sincronizar con Google Calendar. La tarea sí se ha guardado en la agenda.')
    }
  }

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
  async function anadirElemento(datos) {
    const nuevo = { ...datos, id: Date.now(), hecho: false, avisado: false }
    setElementos([...elementos, nuevo])
    cerrarModal()

    if (!puedeSincronizar) return
    try {
      const eventId = await crearEvento(usuario.token, nuevo)
      setElementos((prev) =>
        prev.map((e) => (e.id === nuevo.id ? { ...e, eventId } : e))
      )
    } catch (error) {
      manejarErrorGoogle(error)
    }
  }

  async function guardarEdicion(datos) {
    const original = modal.elemento
    const actualizado = { ...original, ...datos, avisado: false }
    setElementos(elementos.map((e) => (e.id === original.id ? actualizado : e)))
    cerrarModal()

    if (!puedeSincronizar) return
    try {
      if (actualizado.eventId) {
        await actualizarEvento(usuario.token, actualizado.eventId, actualizado)
      } else {
        const eventId = await crearEvento(usuario.token, actualizado)
        setElementos((prev) =>
          prev.map((e) => (e.id === actualizado.id ? { ...e, eventId } : e))
        )
      }
    } catch (error) {
      manejarErrorGoogle(error)
    }
  }

  async function borrarElemento(id) {
    const elemento = elementos.find((e) => e.id === id)
    setElementos(elementos.filter((e) => e.id !== id))
    cerrarModal()

    if (!puedeSincronizar || !elemento?.eventId) return
    try {
      await borrarEvento(usuario.token, elemento.eventId)
    } catch (error) {
      manejarErrorGoogle(error)
    }
  }



  function alternarHecho(id) {
    setElementos(
      elementos.map((e) => (e.id === id ? { ...e, hecho: !e.hecho } : e))
    )
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
        <div className="barra-superior">
          {avisoSync && (
            <p className="aviso-sync" onClick={() => setAvisoSync('')}>
              {avisoSync} ×
            </p>
          )}
          <Notificaciones />
          <CuentaGoogle
            usuario={usuario}
            error={error}
            onLogin={iniciarSesion}
            onLogout={cerrarSesion}
          />
        </div>
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