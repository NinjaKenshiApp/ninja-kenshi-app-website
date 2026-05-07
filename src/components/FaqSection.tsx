import { motion } from 'framer-motion'
import { SectionHeading } from './SectionHeading'

const faqItems = [
  {
    question: '¿Las apps funcionan para cualquier tipo de negocio?',
    answer:
      'Sí. Cada app está diseñada para ser flexible y adaptable a distintos rubros y necesidades. MAIA POS funciona desde kioscos y rotiserías hasta pastelerías o carnicerías, y CostCalc Pro aplica a cualquier producto que se fabrique o elabore.',
  },
  {
    question: '¿Necesito conocimientos técnicos para usarlas?',
    answer:
      'No. Las interfaces son simples, intuitivas y pensadas para el uso diario sin capacitación especial. Si sabés usar un celular o una notebook, podés usar nuestras apps.',
  },
  {
    question: '¿Se actualizan con el tiempo?',
    answer:
      'Sí. Cada producto recibe mejoras continuas basadas en el uso real y el feedback de la comunidad. Las actualizaciones se entregan automáticamente sin costo adicional.',
  },
  {
    question: '¿Puedo usar las apps en varios dispositivos?',
    answer:
      'Sí. MAIA POS por ejemplo admite hasta 3 dispositivos simultáneos por suscripción activa, entre Windows y Android. Así podés tener el mostrador y el celular sincronizados.',
  },
  {
    question: '¿Las apps funcionan sin conexión a internet?',
    answer:
      'Sí, funcionar offline es una prioridad. Toda la operación diaria —ventas, inventario, cálculos— se hace de forma local. La conexión solo se usa para autenticación y sincronización de licencias.',
  },
]

/*
Purpose: Frequently asked questions to reduce friction and increase trust.
Key dependencies: shared SectionHeading and simple semantic details.
Integration: Rendered before contact CTA to resolve objections first.
*/
export function FaqSection() {
  return (
    <section id="faqs" className="faq-section" aria-labelledby="faqs-title">
      <SectionHeading
        eyebrow="FAQs"
        title="Respuestas claras antes de empezar"
        subtitle="Todo lo necesario para decidir rapido, con confianza y sin vueltas."
      />

      <div className="faq-list">
        {faqItems.map((item, index) => (
          <motion.details
            key={item.question}
            className="faq-item"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </motion.details>
        ))}
      </div>
    </section>
  )
}
