import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { legalDocumentBySlug } from '../utils/legalDocs'

interface LegalDocumentModalProps {
  slug: string | null
  onClose: () => void
}

export function LegalDocumentModal({ slug, onClose }: LegalDocumentModalProps) {
  const legalDoc = useMemo(() => (slug ? legalDocumentBySlug.get(slug) ?? null : null), [slug])
  const [markdown, setMarkdown] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')

  useEffect(() => {
    if (!legalDoc) {
      setStatus('idle')
      setMarkdown('')
      return
    }

    const controller = new AbortController()
    setStatus('loading')

    fetch(legalDoc.rawUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error('No se pudo cargar el documento legal.')
        }
        return response.text()
      })
      .then((text) => {
        setMarkdown(text)
        setStatus('ready')
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return
        }
        console.error(error)
        setStatus('error')
      })

    return () => {
      controller.abort()
    }
  }, [legalDoc])

  useEffect(() => {
    if (!legalDoc) {
      return
    }

    const previousOverflow = window.document.body.style.overflow
    window.document.body.style.overflow = 'hidden'

    return () => {
      window.document.body.style.overflow = previousOverflow
    }
  }, [legalDoc])

  useEffect(() => {
    if (!legalDoc) {
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
  }, [legalDoc, onClose])

  if (!legalDoc) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop legal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="presentation"
      >
        <motion.dialog
          className="app-modal legal-modal"
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.24 }}
          open
          aria-labelledby="legal-modal-title"
          onClick={(event) => event.stopPropagation()}
        >
          <button type="button" className="modal-close" onClick={onClose}>
            Cerrar
          </button>

          <header className="legal-header">
            <p className="app-status">{legalDoc.appName}</p>
            <h3 id="legal-modal-title">{legalDoc.title}</h3>
            <p className="modal-description">{legalDoc.summary}</p>
            <p className="support-email">Ultima actualizacion: {legalDoc.updatedAt}</p>
          </header>

          <div className="modal-actions legal-actions">
            <a href={legalDoc.sourceUrl} target="_blank" rel="noopener noreferrer" className="button button-ghost">
              Ver fuente en GitHub
            </a>
          </div>

          {status === 'loading' ? <p className="legal-state">Cargando documento...</p> : null}
          {status === 'error' ? (
            <p className="legal-state">
              No se pudo cargar el documento. Podes abrirlo desde el boton "Ver fuente en GitHub".
            </p>
          ) : null}

          {status === 'ready' ? (
            <article className="legal-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
            </article>
          ) : null}
        </motion.dialog>
      </motion.div>
    </AnimatePresence>
  )
}
