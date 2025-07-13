import { toast } from 'react-toastify';

// Configure toast to be less intrusive
export const toastConfig = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  limit: 3, // Limit number of toasts shown at once
};

// Custom toast functions with reduced frequency
let lastToastTime = {};
const TOAST_COOLDOWN = 2000; // 2 seconds between same type of toasts

export const showToast = {
  success: (message) => {
    const now = Date.now();
    const key = `success-${message}`;
    
    if (!lastToastTime[key] || now - lastToastTime[key] > TOAST_COOLDOWN) {
      lastToastTime[key] = now;
      toast.success(message, toastConfig);
    }
  },
  
  error: (message) => {
    const now = Date.now();
    const key = `error-${message}`;
    
    if (!lastToastTime[key] || now - lastToastTime[key] > TOAST_COOLDOWN) {
      lastToastTime[key] = now;
      toast.error(message, toastConfig);
    }
  },
  
  warning: (message) => {
    const now = Date.now();
    const key = `warning-${message}`;
    
    if (!lastToastTime[key] || now - lastToastTime[key] > TOAST_COOLDOWN) {
      lastToastTime[key] = now;
      toast.warning(message, toastConfig);
    }
  },
  
  info: (message) => {
    const now = Date.now();
    const key = `info-${message}`;
    
    if (!lastToastTime[key] || now - lastToastTime[key] > TOAST_COOLDOWN) {
      lastToastTime[key] = now;
      toast.info(message, toastConfig);
    }
  }
}; 