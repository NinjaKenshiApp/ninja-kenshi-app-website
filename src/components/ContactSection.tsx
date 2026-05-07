import { motion } from 'framer-motion'
import { SectionHeading } from './SectionHeading'

/*
Purpose: Support/contact block for doubts and technical help, not sales pitches.
Key dependencies: framer-motion and shared SectionHeading.
Integration: Final conversion section before footer.
*/
export function ContactSection() {
  return (
    <section id="contacto" className="contact-section" aria-labelledby="contacto-title">
      <SectionHeading
        eyebrow="Soporte"
        title="¿Tenés dudas o necesitás ayuda con alguna app?"
        subtitle="Estoy disponible para resolver consultas, reportar un problema o recibir sugerencias sobre los productos."
      />

      <motion.div
        className="contact-panel"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45 }}
      >
        <a
          href="https://instagram.com/elninjakenshi.app"
          target="_blank"
          rel="noopener noreferrer"
          className="button button-primary"
        >
          Hablar por Instagram
        </a>
        <a
          href="mailto:elninjakenshi.app@gmail.com?subject=Consulta%20sobre%20una%20app"
          className="button button-ghost"
        >
          Enviar un email
        </a>
      </motion.div>
    </section>
  )
}
