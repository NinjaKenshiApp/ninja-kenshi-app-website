import { motion } from 'framer-motion'
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
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
      className="app-card"
    >
      {app.logo ? (
        <img src={app.logo} alt={`Logo de ${app.name}`} className="app-logo" loading="lazy" />
      ) : null}

      <p className="app-status">{app.status}</p>
      <h3>{app.name}</h3>
      <p className="app-tagline">{app.tagline}</p>

      <ul className="chip-row" aria-label={`Tecnologias de ${app.name}`}>
        {app.tech.slice(0, 3).map((tech) => (
          <li key={tech} className="chip">
            {tech}
          </li>
        ))}
      </ul>

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
