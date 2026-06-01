import { AiOutlineTikTok } from 'react-icons/ai'
import { FaYoutube } from 'react-icons/fa'
import { FiCoffee, FiInstagram, FiMonitor } from 'react-icons/fi'

/*
Purpose: Persistent footer with external social links and creator attribution.
Key dependencies: react-icons for lightweight social glyphs.
Integration: Rendered at the bottom of the one-page app.
*/
export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-links" aria-label="Redes y soporte">
        <a
          href="https://cafecito.app/ninjakenshi_app"
          target="_blank"
          rel="noopener noreferrer nofollow external"
          referrerPolicy="no-referrer"
          className="social-link"
          aria-label="Cafecito"
        >
          <FiCoffee aria-hidden="true" />
          <span>Cafecito</span>
        </a>
        <a
          href="https://ko-fi.com/ninjakenshi_app"
          target="_blank"
          rel="noopener noreferrer nofollow external"
          referrerPolicy="no-referrer"
          className="social-link"
          aria-label="Ko-fi"
        >
          <FiMonitor aria-hidden="true" />
          <span>Ko-fi</span>
        </a>
        <a
          href="https://instagram.com/elninjakenshi.app"
          target="_blank"
          rel="noopener noreferrer nofollow external"
          referrerPolicy="no-referrer"
          className="social-link"
          aria-label="Instagram"
        >
          <FiInstagram aria-hidden="true" />
          <span>IG</span>
        </a>
        <a
          href="https://youtube.com/@NinjaKenshiApp"
          target="_blank"
          rel="noopener noreferrer nofollow external"
          referrerPolicy="no-referrer"
          className="social-link"
          aria-label="YouTube"
        >
          <FaYoutube aria-hidden="true" />
          <span>YT</span>
        </a>
        <a
          href="https://tiktok.com/@ninjakenshiapp"
          target="_blank"
          rel="noopener noreferrer nofollow external"
          referrerPolicy="no-referrer"
          className="social-link"
          aria-label="TikTok"
        >
          <AiOutlineTikTok aria-hidden="true" />
          <span>TikTok</span>
        </a>
      </div>

      <p className="footer-copy">
        © {year}{' '}
        <a
          href="https://instagram.com/elninjakenshi.app"
          target="_blank"
          rel="noopener noreferrer nofollow external"
          referrerPolicy="no-referrer"
        >
          @El Ninja Kenshi App
        </a>
      </p>
    </footer>
  )
}
