// Simple logger utility to control console output
const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  error: (...args) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  }
};

// Suppress specific console errors in development
if (isDevelopment) {
  const originalError = console.error;
  console.error = (...args) => {
    // Suppress specific error messages
    const message = args[0];
    if (typeof message === 'string') {
      if (message.includes('Warning: ReactDOM.render is no longer supported')) return;
      if (message.includes('Warning: componentWillReceiveProps')) return;
      if (message.includes('Warning: componentWillUpdate')) return;
      if (message.includes('Warning: componentWillMount')) return;
    }
    originalError.apply(console, args);
  };
} 