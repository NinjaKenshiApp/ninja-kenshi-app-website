import { motion, useReducedMotion } from 'framer-motion'

/*
Purpose: Intro section with clear welcome message and quick anchor navigation.
Key dependencies: framer-motion for entrance animations.
Integration: First visible block in the SPA home.
*/
export function HeroIntro() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="hero-intro" id="inicio" aria-labelledby="hero-title">
      <motion.p
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="hero-kicker"
      >
        El Ninja Kenshi APP
      </motion.p>

      <motion.h1
        id="hero-title"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.05 }}
      >
        Software para negocios con precision operativa, velocidad real y una presencia visual que no se olvida.
      </motion.h1>

      <motion.p
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 22 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.12 }}
        className="hero-summary"
      >
        Desde comercios de barrio hasta operaciones que necesitan control fino, construimos sistemas que ordenan ventas, inventario y decisiones
        sin sacrificar ritmo ni identidad de marca.
      </motion.p>

      <motion.nav
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
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
