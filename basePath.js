export function getAppBasePath() {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    // Vite environment
    if (import.meta.env.VITE_DEV_MODE === "preview")
      return "/push-wallet/pr-preview/"; // add support for pr number

    if (import.meta.env.VITE_DEV_MODE === "alpha") return "/";
  } else if (typeof process !== "undefined" && process.env) {
    // Node.js environment (e.g., during the build process)
    if (process.env.VITE_DEV_MODE === "preview")
      return "/push-wallet/pr-preview/"; // add support for pr number

    if (process.env.VITE_DEV_MODE === "alpha") return "/";
  }
  return "/";
}
