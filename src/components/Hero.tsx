/**
 * Hero — Sección principal con headline, descripción y CTA.
 * Muestra la propuesta de valor de Ninja Kenshi como estudio indie.
 */
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-28 px-6 text-center">
      {/* Glow de fondo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative max-w-3xl mx-auto"
      >
        {/* Mascota / Logo grande */}
        <div className="flex justify-center mb-4">
          <img
            src="/logo.png"
            alt="El Ninja Kenshi mascot"
            className="h-40 w-auto object-contain drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 0 32px rgba(124,58,237,0.45))' }}
          />
        </div>

        {/* Badge */}
        <span
          className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full mb-6 border"
          style={{ color: 'var(--accent-2)', borderColor: 'rgba(6,182,212,0.3)', background: 'rgba(6,182,212,0.07)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          Software independiente · Argentina
        </span>

        <h1
          className="text-5xl md:text-6xl font-bold leading-tight mb-6"
          style={{ color: 'var(--text-h)', letterSpacing: '-1.5px' }}
        >
          Apps que{' '}
          <span style={{ backgroundImage: 'linear-gradient(90deg, #f97316, #eab308)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            simplifican
          </span>{' '}
          tu negocio
        </h1>

        <p className="text-lg leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: 'var(--text)' }}>
          Creamos software de escritorio y móvil para pymes y emprendedores.
          Rápido, sin complicaciones, sin mensualidades exageradas.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="#apps"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, var(--accent), #5b21b6)' }}
          >
            Ver apps
            <ArrowDown size={16} />
          </a>
          <a
            href="mailto:contacto@ninjakenshi.app"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-80 border"
            style={{ color: 'var(--text-h)', borderColor: 'var(--border)', background: 'var(--bg-card)' }}
          >
            Escribinos
          </a>
        </div>
      </motion.div>
    </section>
  )
}
