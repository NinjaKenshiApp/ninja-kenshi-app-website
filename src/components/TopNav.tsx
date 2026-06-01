/*
Purpose: Sticky top navigation for the cinematic single-page launcher.
Key dependencies: none.
Integration: Rendered in App above main content.
*/
export function TopNav() {
  return (
    <header className="top-nav" aria-label="Navegacion principal">
      <a href="#inicio" className="top-brand">
        EL NINJA KENSHI APP
      </a>

      <nav className="top-links">
        <a href="#nosotros">Nosotros</a>
        <a href="#apps">Apps</a>
        <a href="#resenas">Resultados</a>
        <a href="#faqs">FAQs</a>
        <a href="#contacto">Contacto</a>
      </nav>
    </header>
  )
}
