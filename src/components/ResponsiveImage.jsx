import { useEffect, useMemo, useRef, useState } from 'react'

const DEFAULT_WIDTHS = [300, 640, 1024, 1440]

function buildImageVariant(url, width, format) {
  try {
    const parsed = new URL(url)
    parsed.searchParams.set('w', String(width))
    parsed.searchParams.set('q', parsed.searchParams.get('q') || '80')

    if (format) {
      parsed.searchParams.set('fm', format)
      parsed.searchParams.set('auto', 'format')
    }

    return parsed.toString()
  } catch {
    return url
  }
}

function buildSrcSet(url, widths, format) {
  return widths.map((width) => `${buildImageVariant(url, width, format)} ${width}w`).join(', ')
}

function isLikelyRemoteImage(url) {
  return /^https?:\/\//.test(url || '')
}

export default function ResponsiveImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  aspectRatio = '16 / 9',
  objectFit = 'cover',
  widths = DEFAULT_WIDTHS,
  sizes = '(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1440px) 33vw, 420px',
  webpSrcSet,
  jpgSrcSet,
  fallbackSrc,
  showAltText = false,
  caption,
  rootMargin = '200px',
  priority = false,
  skeletonClassName = '',
}) {
  const containerRef = useRef(null)
  const [isVisible, setIsVisible] = useState(priority)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (priority || !containerRef.current) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold: 0.1 }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [priority, rootMargin])

  const generatedWebpSrcSet = useMemo(() => {
    if (webpSrcSet) return webpSrcSet
    if (!src || !isLikelyRemoteImage(src)) return ''
    return buildSrcSet(src, widths, 'webp')
  }, [src, webpSrcSet, widths])

  const generatedJpgSrcSet = useMemo(() => {
    if (jpgSrcSet) return jpgSrcSet
    if (!src || !isLikelyRemoteImage(src)) return ''
    return buildSrcSet(src, widths, 'jpg')
  }, [src, jpgSrcSet, widths])

  const resolvedFallbackSrc = useMemo(() => {
    if (fallbackSrc) return fallbackSrc
    if (!src || !isLikelyRemoteImage(src)) return src
    return buildImageVariant(src, widths[Math.min(1, widths.length - 1)] || 640, 'jpg')
  }, [fallbackSrc, src, widths])

  const lowQualityPlaceholder = useMemo(() => {
    if (!src || !isLikelyRemoteImage(src)) return ''
    return buildImageVariant(src, 24, 'jpg')
  }, [src])

  const finalCaption = caption || (showAltText ? alt : '')

  return (
    <figure className={`relative m-0 w-full overflow-hidden ${className}`}>
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden bg-slate-200 dark:bg-white/5"
        style={{ aspectRatio }}
      >
        {!isLoaded && lowQualityPlaceholder ? (
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-105 bg-center bg-cover blur-xl"
            style={{ backgroundImage: `url('${lowQualityPlaceholder}')` }}
          />
        ) : null}

        {!isLoaded ? (
          <div
            aria-hidden="true"
            className={`absolute inset-0 animate-pulse bg-[linear-gradient(110deg,rgba(255,255,255,0.08),rgba(255,255,255,0.22),rgba(255,255,255,0.08))] bg-[length:200%_100%] ${skeletonClassName}`}
          />
        ) : null}

        {isVisible ? (
          <picture>
            {generatedWebpSrcSet ? <source type="image/webp" srcSet={generatedWebpSrcSet} sizes={sizes} /> : null}
            {generatedJpgSrcSet ? <source type="image/jpeg" srcSet={generatedJpgSrcSet} sizes={sizes} /> : null}
            <img
              src={hasError ? fallbackSrc || src : resolvedFallbackSrc}
              alt={alt}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              fetchpriority={priority ? 'high' : 'auto'}
              onLoad={() => setIsLoaded(true)}
              onError={() => {
                setHasError(true)
                setIsLoaded(true)
              }}
              className={`h-full w-full transition duration-500 ${isLoaded ? 'scale-100 opacity-100' : 'scale-[1.03] opacity-0'} ${imgClassName}`}
              style={{ objectFit }}
            />
          </picture>
        ) : null}
      </div>

      {finalCaption ? (
        <figcaption className="mt-2 text-xs leading-5 text-slate-500 dark:text-white/55">
          {finalCaption}
        </figcaption>
      ) : null}
    </figure>
  )
}
