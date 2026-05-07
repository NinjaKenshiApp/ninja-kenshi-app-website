/**
 * AppsSection — Grid de aplicaciones disponibles.
 * Agregar nuevas apps editando el array APPS.
 */
import { motion } from 'framer-motion'
import AppCard from './AppCard'

const APPS = [
  {
    name: 'MAIA POS',
    tagline: 'Punto de venta inteligente',
    description:
      'Sistema POS completo para negocios: inventario, ventas, clientes, reportes, módulo gastronómico, facturación AFIP y más. Disponible para Windows y Android.',
    badge: 'v1.0.8',
    badgeColor: '#7c3aed',
    gradient: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    platforms: [
      {
        label: 'Windows (.exe)',
        type: 'windows' as const,
        href: 'https://github.com/tu-usuario/maia-pos/releases/latest',
      },
      {
        label: 'Android (.apk)',
        type: 'android' as const,
        href: 'https://github.com/tu-usuario/maia-pos/releases/latest',
      },
    ],
    delay: 0.1,
  },
  // ── Próximamente ──
  {
    name: 'Próximamente',
    tagline: 'Nuevo proyecto en desarrollo',
    description:
      'Estamos trabajando en nuevas herramientas para simplificar la gestión de tu negocio. Suscribite para recibir novedades.',
    badge: 'Pronto',
    badgeColor: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #0284c7)',
    platforms: [
      {
        label: 'Notificarme',
        type: 'windows' as const,
        href: 'mailto:contacto@ninjakenshi.app?subject=Quiero%20novedades',
      },
    ],
    delay: 0.2,
  },
]

export default function AppsSection() {
  return (
    <section id="apps" className="py-20 px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h2
          className="text-3xl md:text-4xl font-bold mb-3"
          style={{ color: 'var(--text-h)', letterSpacing: '-0.8px' }}
        >
          Nuestras apps
        </h2>
        <p className="text-base" style={{ color: 'var(--text)' }}>
          Software diseñado para el mercado hispanohablante.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {APPS.map((app) => (
          <AppCard key={app.name} {...app} />
        ))}
      </div>
    </section>
  )
}
