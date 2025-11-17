// Testing Library Setup
import '@testing-library/jest-dom';

// Console Warning Suppression
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = jest.fn((...args) => {
    if (
      args[0] &&
      typeof args[0] === 'string' &&
      (args[0].includes('componentWillMount') ||
       args[0].includes('componentWillReceiveProps') ||
       args[0].includes('componentWillUpdate') ||
       args[0].includes('React Router Future Flag Warning') ||
       args[0].includes('v7_startTransition') ||
       args[0].includes('v7_relativeSplatPath'))
    ) {
      return; // Silence these warnings ✅
    }
    originalWarn.call(console, ...args);
  });
});

afterAll(() => {
  console.warn = originalWarn;
});

// Console Error Suppression
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn((...args) => {
    if (
      args[0] &&
      typeof args[0] === 'string' &&
      (args[0].includes('Encountered two children with the same key') ||
       args[0].includes('Not a valid selector'))
    ) {
      return; // Silence these errors
    }
    originalError.call(console, ...args);
  });
});

afterAll(() => {
  console.error = originalError;
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;
