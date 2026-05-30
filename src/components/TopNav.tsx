import { FiMoon, FiSun } from 'react-icons/fi'

interface TopNavProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

/*
Purpose: Sticky top navigation with quick anchors and theme toggle.
Key dependencies: react-icons.
Integration: Rendered in App above main content.
*/
export function TopNav({ theme, onToggleTheme }: TopNavProps) {
  return (
    <header className="top-nav" aria-label="Navegacion principal">
      <a href="#inicio" className="top-brand">
        Ninja Kenshi Apps
      </a>

      <nav className="top-links">
        <a href="#nosotros">Nosotros</a>
        <a href="#apps">Apps</a>
        <a href="#resenas">Resultados</a>
        <a href="#faqs">FAQs</a>
        <a href="#contacto">Contacto</a>
      </nav>

      <button type="button" className="theme-toggle" onClick={onToggleTheme} aria-label="Cambiar tema">
        {theme === 'dark' ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
      </button>
    </header>
  )
}
