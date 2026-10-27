import Modal from './Modal'
import Formulario from './Formulario'
import { enlaceGoogleCalendar } from '../utils/calendario'

function ModalTarea({
  modal,
  asignaturaInicial,
  onAnadir,
  onGuardar,
  onAlternar,
  onBorrar,
  onCerrar,
}) {
  const editando = modal.modo === 'editar'
  const elemento = modal.elemento

  function confirmarBorrado() {
    if (window.confirm(`¿Borrar "${elemento.titulo}"?`)) {
      onBorrar(elemento.id)
    }
  }

  return (
    <Modal titulo={editando ? 'Editar' : 'Nueva tarea o examen'} onCerrar={onCerrar}>
      <Formulario
        inicial={editando ? elemento : null}
        fechaInicial={modal.fecha}
        asignaturaInicial={asignaturaInicial}
        onAnadir={onAnadir}
        onGuardar={onGuardar}
        onCancelar={onCerrar}
      />

      {editando && (
        <div className="modal-acciones">
          <button
            onClick={() => {
              onAlternar(elemento.id)
              onCerrar()
            }}
          >
            {elemento.hecho ? 'Marcar como pendiente' : 'Marcar como hecho'}
          </button>
          {editando && (
            <div className="modal-acciones">
              <button
                onClick={() => {
                  onAlternar(elemento.id)
                  onCerrar()
                }}
              >
                {elemento.hecho ? 'Marcar como pendiente' : 'Marcar como hecho'}
              </button>

              {!elemento.hecho && (
                <a
                  href={enlaceGoogleCalendar(elemento)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Añadir a Google Calendar
                </a>
              )}

              <button className="borrar" onClick={confirmarBorrado}>
                Borrar
              </button>
            </div>
          )}
          <button className="borrar" onClick={confirmarBorrado}>
            Borrar
          </button>
        </div>
      )}
    </Modal>
  )
}

export default ModalTarea