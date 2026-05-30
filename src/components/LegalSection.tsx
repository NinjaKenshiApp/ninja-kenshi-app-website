import { motion } from 'framer-motion'
import { legalDocuments } from '../utils/legalDocs'
import { SectionHeading } from './SectionHeading'

interface LegalSectionProps {
  onOpenLegal: (slug: string) => void
}

export function LegalSection({ onOpenLegal }: LegalSectionProps) {
  return (
    <section id="legal" aria-labelledby="legal-title">
      <SectionHeading
        eyebrow="Centro legal"
        title="Documentos claros y unificados"
        subtitle="Toda la documentacion de MAIA POS y CostCalc Pro en una vista mas profesional y facil de leer."
      />

      <div className="legal-grid">
        {legalDocuments.map((doc, index) => (
          <motion.article
            key={doc.slug}
            className="legal-card"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: index * 0.04 }}
          >
            <p className="app-status">{doc.appName}</p>
            <h3>{doc.title}</h3>
            <p className="app-tagline">{doc.summary}</p>
            <button type="button" className="button button-ghost" onClick={() => onOpenLegal(doc.slug)}>
              Abrir documento
            </button>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
