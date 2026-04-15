import { useState } from 'react'
import './TopBanner.css'

export default function TopBanner({ onQuoteClick }) {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  return (
    <div className="top-banner">
      <div className="top-banner-inner">
        <span className="top-banner-text">
          <span className="top-banner-emoji">✨</span>
          <strong>FREE Service:</strong> Get your complete BOQ & Project Quotation — absolutely free!
        </span>
        <button className="top-banner-btn" onClick={onQuoteClick}>Get Free BOQ →</button>
        <button className="top-banner-close" onClick={() => setVisible(false)} aria-label="Close banner">×</button>
      </div>
    </div>
  )
}
