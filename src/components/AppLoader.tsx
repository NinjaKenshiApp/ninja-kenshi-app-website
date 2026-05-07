import { AnimatePresence, motion } from 'framer-motion'

interface AppLoaderProps {
  isVisible: boolean
}

/*
Purpose: Branded loading screen with layered animation before the SPA appears.
Key dependencies: framer-motion for fade/scale transitions.
Integration: Rendered in App root and hidden after initial timeout.
*/
export function AppLoader({ isVisible }: AppLoaderProps) {
  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          className="app-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.55 } }}
          role="status"
          aria-live="polite"
          aria-label="Cargando Ninja Kenshi Apps"
        >
          <div className="loader-scene">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="loader-ring"
                animate={{ scale: [1, 2.6], opacity: [0.55, 0] }}
                transition={{ duration: 2.1, repeat: Infinity, ease: 'easeOut', delay: i * 0.65 }}
              />
            ))}
            <motion.div
              className="loader-orb"
              animate={{
                scale: [1, 1.12, 1],
                boxShadow: [
                  '0 0 28px 8px rgba(211,105,56,0.26)',
                  '0 0 52px 18px rgba(211,105,56,0.46)',
                  '0 0 28px 8px rgba(211,105,56,0.26)',
                ],
              }}
              transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <motion.p
            className="loader-brand"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
          >
            Ninja Kenshi Apps
          </motion.p>

          <motion.p
            className="loader-tagline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.55 }}
          >
            Apps que simplifican tu día.
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
