require('@testing-library/jest-dom')

const { TextDecoder, TextEncoder } = require('util')

Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
})

Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
  writable: true,
  value: jest.fn(),
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = IntersectionObserverMock
global.ResizeObserver = ResizeObserverMock
global.requestAnimationFrame = (cb) => setTimeout(cb, 0)
global.cancelAnimationFrame = (id) => clearTimeout(id)
global.TextEncoder = global.TextEncoder || TextEncoder
global.TextDecoder = global.TextDecoder || TextDecoder
global.open = jest.fn()
globalThis.__SSR_ENV__ = {}
globalThis.structuredClone =
  globalThis.structuredClone ||
  ((value) => JSON.parse(JSON.stringify(value)))
