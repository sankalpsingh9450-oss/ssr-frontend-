export const heroContainer = (reduceMotion) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: reduceMotion ? 0 : 0.12,
      delayChildren: reduceMotion ? 0 : 0.08,
    },
  },
})

export const heroItem = (reduceMotion) => ({
  hidden: {
    opacity: 0,
    y: reduceMotion ? 0 : 24,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: reduceMotion ? 0.01 : 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
})

export const heroBadge = (reduceMotion) => ({
  hidden: {
    opacity: 0,
    scale: reduceMotion ? 1 : 0.96,
    y: reduceMotion ? 0 : 16,
  },
  show: (index = 0) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: reduceMotion ? 0.01 : 0.45,
      delay: reduceMotion ? 0 : 0.24 + index * 0.06,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
})
