import { useState } from 'react'
import './TopBanner.css'

export default function TopBanner({ onQuoteClick }) {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  return (
    <div className="top-banner">
      <div className="top-banner-inner">
        <span className="top-banner-text">
          <span className="top-banner-emoji">◆</span>
          <strong>Blueprint Desk:</strong> Free BOQ, quotation strategy, and project scoping for serious enquiries.
        </span>
        <button className="top-banner-btn" onClick={onQuoteClick}>Book Free BOQ →</button>
        <button className="top-banner-close" onClick={() => setVisible(false)} aria-label="Close banner">×</button>
      </div>
    </div>
  )
}
