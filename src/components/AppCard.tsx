import { motion, useReducedMotion } from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'
import type { AppItem } from '../types/site'

interface AppCardProps {
  app: AppItem
  onOpen: (app: AppItem) => void
}

/*
Purpose: Compact card with app snapshot and CTA to open modal details.
Key dependencies: framer-motion for subtle hover/tap transitions.
Integration: Rendered by AppsShowcase grid.
*/
export function AppCard({ app, onOpen }: AppCardProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduceMotion ? 0.2 : 0.38 }}
      className="app-card"
    >
      {app.logo ? (
        <img src={app.logo} alt={`Logo de ${app.name}`} className="app-logo" loading="lazy" />
      ) : null}

      <p className="app-status">{app.status}</p>
      <h3>{app.name}</h3>
      <p className="app-tagline">{app.tagline}</p>

      <button
        type="button"
        className="button button-primary app-open"
        onClick={() => onOpen(app)}
      >
        Ver detalles <FiArrowUpRight aria-hidden="true" />
      </button>
    </motion.article>
  )
}
