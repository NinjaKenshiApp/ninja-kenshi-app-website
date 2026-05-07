import { AnimatePresence, motion } from 'framer-motion'
import { FiDownload } from 'react-icons/fi'
import { useEffect } from 'react'
import type { AppItem } from '../types/site'

function ComingSoonAnimation({ name }: { name: string }) {
  return (
    <div className="coming-soon-wrap">
      <motion.div
        className="coming-orb"
        animate={{
          scale: [1, 1.18, 1, 1.08, 1],
          opacity: [0.6, 1, 0.6, 0.88, 0.6],
        }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div className="coming-rings">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="coming-ring"
            animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: i * 0.75 }}
          />
        ))}
      </motion.div>
      <motion.p
        className="coming-title"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        Próximamente
      </motion.p>
      <motion.p
        className="coming-sub"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        {name} está en camino. Seguí de cerca los lanzamientos de Ninja Kenshi Apps.
      </motion.p>
    </div>
  )
}

interface AppModalProps {
  app: AppItem | null
  onClose: () => void
}

/*
Purpose: Rich modal with full app details and actions.
Key dependencies: framer-motion for presence transitions.
Integration: Controlled by App selected state from top-level App.
*/
export function AppModal({ app, onClose }: AppModalProps) {
  useEffect(() => {
    if (!app) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [app])

  useEffect(() => {
    if (!app) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [app, onClose])

  return (
    <AnimatePresence>
      {app ? (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="presentation"
        >
          <motion.dialog
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.24 }}
            className="app-modal"
            open
            aria-labelledby="app-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="modal-close" onClick={onClose}>
              Cerrar
            </button>
            {app.logo ? (
              <img src={app.logo} alt={`Logo de ${app.name}`} className="modal-logo" loading="lazy" />
            ) : null}
            <p className="app-status">{app.status}</p>
            <h3 id="app-modal-title">{app.name}</h3>
            <p className="app-tagline">{app.tagline}</p>
            <p className="modal-description">{app.description}</p>

            {app.status === 'Proximamente' ? (
              <ComingSoonAnimation name={app.name} />
            ) : (
              <>
                <div className="modal-grid">
                  <div>
                    <p className="meta-label">Version</p>
                    <p>{app.version}</p>
                  </div>
                  <div>
                    <p className="meta-label">Ultima actualizacion</p>
                    <p>{app.lastUpdate}</p>
                  </div>
                </div>

                <h4>Highlights</h4>
                <ul className="modal-list">
                  {app.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>

                {app.modules?.length ? (
                  <>
                    <h4>Modulos</h4>
                    <div className="modal-stacks">
                      {app.modules.map((module) => (
                        <section key={module.title} className="modal-stack-card">
                          <p className="meta-label">{module.title}</p>
                          <ul className="modal-list">
                            {module.items.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </section>
                      ))}
                    </div>
                  </>
                ) : null}

                {app.plans?.length ? (
                  <>
                    <h4>Planes</h4>
                    <div className="modal-stacks modal-plans">
                      {app.plans.map((plan) => (
                        <article key={plan.name} className="modal-stack-card">
                          <p className="meta-label">{plan.name}</p>
                          <p className="plan-price">{plan.price}</p>
                          <p>{plan.description}</p>
                        </article>
                      ))}
                    </div>
                  </>
                ) : null}

                {app.platforms?.length ? (
                  <>
                    <h4>Plataformas</h4>
                    <div className="modal-stacks modal-platforms">
                      {app.platforms.map((platform) => (
                        <article key={platform.name} className="modal-stack-card">
                          <p className="meta-label">{platform.name}</p>
                          <p>{platform.tech}</p>
                          <p className="platform-requirement">{platform.requirement}</p>
                          {platform.downloadUrl ? (
                            <a
                              href={platform.downloadUrl}
                              className="button button-primary platform-download"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FiDownload aria-hidden="true" />
                              {platform.downloadLabel ?? 'Descargar'}
                            </a>
                          ) : null}
                        </article>
                      ))}
                    </div>
                  </>
                ) : null}

                {app.security?.length ? (
                  <>
                    <h4>Seguridad y privacidad</h4>
                    <ul className="modal-list">
                      {app.security.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </>
                ) : null}

                {app.legalLinks?.length ? (
                  <>
                    <h4>Documentacion legal</h4>
                    <div className="modal-actions">
                      {app.legalLinks.map((legal) => (
                        <a key={legal.label} href={legal.href} className="button button-ghost" target="_blank" rel="noopener noreferrer">
                          {legal.label}
                        </a>
                      ))}
                    </div>
                  </>
                ) : null}

                {app.supportEmail ? <p className="support-email">Contacto: {app.supportEmail}</p> : null}

                {app.repoUrl || app.storeUrl ? (
                  <div className="modal-actions">
                    {app.storeUrl ? (
                      <a href={app.storeUrl} className="button button-primary" target="_blank" rel="noopener noreferrer">
                        Ver app
                      </a>
                    ) : null}
                    {app.repoUrl ? (
                      <a href={app.repoUrl} className="button button-ghost" target="_blank" rel="noopener noreferrer">
                        Documentación
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </>
            )}
          </motion.dialog>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
