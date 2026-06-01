import { motion } from 'framer-motion'
import { SectionHeading } from './SectionHeading'

const pillars = [
  {
    title: 'Producto util',
    text: 'Diseñamos apps pensadas para el dia a dia real de negocios y equipos chicos.',
  },
  {
    title: 'Experiencia fluida',
    text: 'Interfaces claras, rapidas y orientadas a conversion desde el primer uso.',
  },
  {
    title: 'Evolucion constante',
    text: 'Cada app mejora con feedback real, datos de uso y objetivos comerciales.',
  },
]

/*
Purpose: Brand section that explains studio philosophy and value proposition.
Key dependencies: framer-motion and shared SectionHeading.
Integration: Rendered in the main one-page flow.
*/
export function AboutSection() {
  return (
    <section id="nosotros" className="about-section" aria-labelledby="nosotros-title">
      <SectionHeading
        eyebrow="Nosotros"
        title="Construimos apps con criterio de negocio, diseño y ejecucion"
        subtitle="El Ninja Kenshi APP combina estrategia de producto y desarrollo agil para transformar procesos complejos en experiencias simples y memorables."
      />

      <div className="about-grid">
        {pillars.map((pillar, index) => (
          <motion.article
            key={pillar.title}
            className="about-card"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
          >
            <h3>{pillar.title}</h3>
            <p>{pillar.text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
