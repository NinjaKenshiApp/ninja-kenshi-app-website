/**
 * Footer — Pie de página con créditos, links de redes y contacto.
 */
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="border-t mt-auto py-10 px-6"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="El Ninja Kenshi" className="h-9 w-auto object-contain" />
          <span className="text-sm" style={{ color: 'var(--text)' }}>
            © {year} El Ninja Kenshi · Hecho en Argentina 🇦🇷
          </span>
        </div>

        <div className="flex items-center gap-5 text-sm" style={{ color: 'var(--text)' }}>
          <a
            href="mailto:contacto@ninjakenshi.app"
            className="transition-colors hover:text-white"
          >
            contacto@ninjakenshi.app
          </a>
          <a
            href="https://github.com/tu-usuario"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
