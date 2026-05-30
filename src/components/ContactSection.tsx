import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { FiInstagram, FiMail } from 'react-icons/fi'
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
        className="contact-panel contact-links"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45 }}
      >
        <a
          href="https://wa.me/5491156322591?text=Hola%21%20Quiero%20saber%20m%C3%A1s%20sobre%20las%20apps%20de%20Ninja%20Kenshi."
          target="_blank"
          rel="noopener noreferrer"
          className="contact-link"
          aria-label="WhatsApp"
        >
          <FaWhatsapp aria-hidden="true" />
          <span>WhatsApp</span>
        </a>
        <a
          href="https://instagram.com/elninjakenshi.app"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-link"
          aria-label="Instagram"
        >
          <FiInstagram aria-hidden="true" />
          <span>Instagram</span>
        </a>
        <a
          href="mailto:elninjakenshi.app@gmail.com?subject=Consulta%20sobre%20una%20app"
          className="contact-link"
          aria-label="Email"
        >
          <FiMail aria-hidden="true" />
          <span>Email</span>
        </a>
      </motion.div>
    </section>
  )
}
