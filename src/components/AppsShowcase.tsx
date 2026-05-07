import { motion } from 'framer-motion'
import type { AppItem } from '../types/site'
import { appItems } from '../utils/siteContent'
import { AppCard } from './AppCard'
import { SectionHeading } from './SectionHeading'

interface AppsShowcaseProps {
  onOpenApp: (app: AppItem) => void
}

/*
Purpose: Main apps gallery section with a responsive card grid.
Key dependencies: framer-motion for staggered reveal, local app content data.
Integration: Receives modal opener callback from App container.
*/
export function AppsShowcase({ onOpenApp }: AppsShowcaseProps) {
  return (
    <section className="apps-section" id="apps" aria-labelledby="apps-title">
      <SectionHeading
        eyebrow="Portfolio"
        title="Apps que convierten horas de caos en control total"
        subtitle="Soluciones listas para operar, escalar y crecer con vos."
      />

      <motion.div
        className="apps-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.08 },
          },
        }}
      >
        {appItems.map((app) => (
          <AppCard key={app.id} app={app} onOpen={onOpenApp} />
        ))}
      </motion.div>
    </section>
  )
}
