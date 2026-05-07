/**
 * Navbar — Barra de navegación sticky con logo y link de contacto.
 */
import { motion } from 'framer-motion'

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b"
      style={{ borderColor: 'var(--border)', background: 'rgba(13,13,18,0.85)', backdropFilter: 'blur(16px)' }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="El Ninja Kenshi"
            className="h-11 w-auto object-contain drop-shadow-lg"
          />
          <span className="font-semibold text-sm" style={{ color: 'var(--text-h)' }}>
            El Ninja Kenshi
          </span>
        </div>

        <nav className="flex items-center gap-6 text-sm">
          <a href="#apps" className="transition-colors hover:text-white" style={{ color: 'var(--text)' }}>
            Apps
          </a>
          <a
            href="mailto:contacto@ninjakenshi.app"
            className="px-4 py-1.5 rounded-lg text-white text-sm transition-all hover:opacity-80"
            style={{ background: 'var(--accent)' }}
          >
            Contacto
          </a>
        </nav>
      </div>
    </motion.header>
  )
}
