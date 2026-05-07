import { FaWhatsapp } from 'react-icons/fa'

/*
Purpose: Floating WhatsApp button for quick direct contact.
Key dependencies: react-icons/fa for the WhatsApp icon.
Integration: Rendered globally near page bottom-right.
*/
export function FloatingCta() {
  return (
    <a
      href="https://wa.me/5491156322591?text=Hola%21%20Quiero%20saber%20m%C3%A1s%20sobre%20las%20apps%20de%20Ninja%20Kenshi."
      className="floating-cta"
      aria-label="Contactar por WhatsApp"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FaWhatsapp aria-hidden="true" />
      <span>WhatsApp</span>
    </a>
  )
}
