import { motion } from 'framer-motion'
import { brandMeta } from '../utils/siteContent'

/*
Purpose: Intro section with clear welcome message and quick anchor navigation.
Key dependencies: framer-motion for entrance animations.
Integration: First visible block in the SPA home.
*/
export function HeroIntro() {
  return (
    <section className="hero-intro" id="inicio" aria-labelledby="hero-title">
      {brandMeta.logo ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
        >
          <motion.img
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, repeatDelay: 8, ease: 'easeInOut', delay: 1.8 }}
            src={brandMeta.logo}
            alt={brandMeta.name}
            className="hero-logo"
          />
        </motion.div>
      ) : null}

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="hero-kicker"
      >
        Ninja Kenshi Apps
      </motion.p>

      <motion.h1
        id="hero-title"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.05 }}
      >
        Bienvenidos a Ninja Kenshi Apps: creamos aplicaciones que resuelven problemas cotidianos de forma simple, rapida y rentable.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.12 }}
        className="hero-summary"
      >
          Desde comercios de barrio hasta emprendimientos en crecimiento, diseñamos productos
        digitales pensados para vender mas, trabajar mejor y decidir con claridad.
      </motion.p>

      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="hero-actions"
        aria-label="Navegacion principal de la pagina"
      >
        <a href="#apps" className="button button-primary">
          Descubrir apps
        </a>
        <a href="#resenas" className="button button-ghost">
          Ver resultados reales
        </a>
      </motion.nav>
    </section>
  )
}
