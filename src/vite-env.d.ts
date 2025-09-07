/// <reference types="vite/client" />

declare global {
  interface Window {
    __isRedirecting?: boolean;
  }
}

export {};
