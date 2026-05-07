import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { reviews } from '../utils/siteContent'
import { SectionHeading } from './SectionHeading'

/*
Purpose: Interactive testimonial carousel with controls and pagination dots.
Key dependencies: framer-motion for slide transitions.
Integration: Rendered as one-page section after apps showcase.
*/
export function ReviewsCarousel() {
  const [index, setIndex] = useState(0)
  const [isAutoPaused, setIsAutoPaused] = useState(false)

  const review = reviews[index]

  const move = useCallback((direction: 1 | -1) => {
    setIndex((previous) => {
      const total = reviews.length
      return (previous + direction + total) % total
    })
  }, [])

  useEffect(() => {
    if (isAutoPaused) {
      return
    }

    const timer = window.setInterval(() => {
      move(1)
    }, 4200)

    return () => {
      window.clearInterval(timer)
    }
  }, [isAutoPaused, move])

  return (
    <section className="reviews-section" id="resenas" aria-labelledby="resenas-title">
      <SectionHeading
        eyebrow="Impacto"
        title="Clientes reales, mejoras reales"
        subtitle="Historias de negocios que ordenaron su operacion y aumentaron resultados con Ninja Kenshi Apps."
      />

      <div
        className="carousel-shell"
        onMouseEnter={() => setIsAutoPaused(true)}
        onMouseLeave={() => setIsAutoPaused(false)}
        onFocusCapture={() => setIsAutoPaused(true)}
        onBlurCapture={() => setIsAutoPaused(false)}
      >
        <button
          type="button"
          onClick={() => move(-1)}
          className="carousel-control"
          aria-label="Reseña anterior"
        >
          <span aria-hidden="true">&#8249;</span>
        </button>

        <AnimatePresence mode="wait">
          <motion.article
            key={review.id}
            className="review-card"
            initial={{ opacity: 0, x: 22 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -22 }}
            transition={{ duration: 0.28 }}
          >
            <p className="review-quote">&ldquo;{review.quote}&rdquo;</p>
            <p className="review-author">{review.author}</p>
            <p className="review-role">{review.role}</p>
            <p className="review-rating" aria-label={`Calificacion de ${review.rating} sobre 5`}>
              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
            </p>
          </motion.article>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => move(1)}
          className="carousel-control"
          aria-label="Siguiente reseña"
        >
          <span aria-hidden="true">&#8250;</span>
        </button>
      </div>

      <div className="carousel-dots" role="tablist" aria-label="Selección de reseñas">
        {reviews.map((item, dotIndex) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={dotIndex === index}
            aria-label={`Ir a reseña ${dotIndex + 1}`}
            className={dotIndex === index ? 'dot active' : 'dot'}
            onClick={() => setIndex(dotIndex)}
          />
        ))}
      </div>

      <p className="carousel-auto-status" aria-live="polite">
        {isAutoPaused ? 'Carrusel en pausa.' : 'Carrusel reproduciendose automaticamente.'}
      </p>
    </section>
  )
}
