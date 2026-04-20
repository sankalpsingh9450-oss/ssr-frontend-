export function getRuntimeEnv(key, fallback = '') {
  const runtimeEnv = (typeof globalThis !== 'undefined' && globalThis.__SSR_ENV__) || {}
  const value = runtimeEnv?.[key]
  return value ?? fallback
}
