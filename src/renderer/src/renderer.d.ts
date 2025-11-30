export { }

declare global {
  interface Window {
    api: {
      db: {
        ping: () => string
      }
    }
  }
}
