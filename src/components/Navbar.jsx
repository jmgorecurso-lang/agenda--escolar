import logo from '../assets/logocho.png'
import titulo from '../assets/logotitu.png'
import { asignaturas } from '../data/asignaturas'

function Navbar({ onSelect, activa }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="logo" />
      </div>
      <img src={titulo} className="logoTitulo" alt="Agenda escolar" />

      <ul className="navbar-menu">
        <li>
          <button
            className={activa === null ? 'activo' : ''}
            onClick={() => onSelect(null)}
          >
            Inicio
          </button>
        </li>

        {asignaturas.map((a) => {
          const esActiva = activa === a.nombre || a.subasignaturas?.includes(activa)

          return (
            <li key={a.nombre} className={a.subasignaturas ? 'dropdown' : ''}>
              <button
                className={esActiva ? 'activo' : ''}
                onClick={() => onSelect(a.nombre)}
              >
                {a.nombre}
              </button>

              {a.subasignaturas && (
                <ul className="navbar-submenu">
                  {a.subasignaturas.map((s) => (
                    <li key={s}>
                      <button
                        className={activa === s ? 'activo' : ''}
                        onClick={() => onSelect(s)}
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
export default Navbar