function reportMetric(name, value, extra = {}) {
  const payload = { name, value, ...extra }

  if (window.gtag) {
    window.gtag('event', name, payload)
  }

  window.dispatchEvent(new CustomEvent('ssr:performance-metric', { detail: payload }))
}

export function initPerformanceMonitoring() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return

  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const lastEntry = entryList.getEntries().at(-1)
      if (lastEntry) reportMetric('LCP', Math.round(lastEntry.startTime))
    })
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })

    let clsValue = 0
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) clsValue += entry.value
      }
      reportMetric('CLS', Number(clsValue.toFixed(4)))
    })
    clsObserver.observe({ type: 'layout-shift', buffered: true })

    const paintObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          reportMetric('FCP', Math.round(entry.startTime))
        }
      }
    })
    paintObserver.observe({ type: 'paint', buffered: true })

    const inputObserver = new PerformanceObserver((entryList) => {
      const firstInput = entryList.getEntries()[0]
      if (firstInput) {
        reportMetric('FID', Math.round(firstInput.processingStart - firstInput.startTime))
      }
    })
    inputObserver.observe({ type: 'first-input', buffered: true })
  } catch {
    // Ignore unsupported observer types.
  }
}
