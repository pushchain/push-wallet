export function getAppBasePath() {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    // Vite environment
    return import.meta.env.VITE_DEV_MODE
      ? import.meta.env.VITE_DEV_MODE === "localhost"
        ? "/"
        : "/push-wallet/"
      : "/";
  } else if (typeof process !== "undefined" && process.env) {
    // Node.js environment (e.g., during the build process)
    return process.env.VITE_DEV_MODE
      ? process.env.VITE_DEV_MODE === "localhost"
        ? "/"
        : "/push-wallet/"
      : "/";
  }
  return "";
}
