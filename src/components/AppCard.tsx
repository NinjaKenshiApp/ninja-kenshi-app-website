/**
 * AppCard — Tarjeta individual de una app con badges de plataforma,
 * descripción y botones de descarga/más info.
 */
import { motion } from 'framer-motion'
import { Download, ExternalLink, Monitor, Smartphone } from 'lucide-react'

interface Platform {
  label: string
  type: 'windows' | 'android'
  href: string
}

interface AppCardProps {
  name: string
  tagline: string
  description: string
  badge: string
  badgeColor: string
  platforms: Platform[]
  gradient: string
  delay?: number
}

const PlatformIcon = ({ type }: { type: 'windows' | 'android' }) =>
  type === 'windows' ? <Monitor size={14} /> : <Smartphone size={14} />

export default function AppCard({
  name,
  tagline,
  description,
  badge,
  badgeColor,
  platforms,
  gradient,
  delay = 0,
}: AppCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className="rounded-2xl p-6 border flex flex-col gap-5 cursor-default"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border)',
        transition: 'background 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-card)')}
    >
      {/* Icono / logo placeholder */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
        style={{ background: gradient }}
      >
        {name.slice(0, 1)}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-h)' }}>
            {name}
          </h2>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: badgeColor + '22', color: badgeColor }}
          >
            {badge}
          </span>
        </div>
        <p className="text-sm font-medium mb-2" style={{ color: 'var(--accent-2)' }}>
          {tagline}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
          {description}
        </p>
      </div>

      {/* Plataformas */}
      <div className="flex flex-wrap gap-2">
        {platforms.map((p) => (
          <a
            key={p.label}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all hover:opacity-80"
            style={{ borderColor: 'var(--border)', color: 'var(--text-h)', background: 'rgba(255,255,255,0.04)' }}
          >
            <PlatformIcon type={p.type} />
            {p.label}
            {p.href !== '#' ? <Download size={11} /> : <ExternalLink size={11} />}
          </a>
        ))}
      </div>
    </motion.article>
  )
}
