import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nodePolyfills({
      // You can add options here if needed
      // For example, enable specific polyfills
      // include: ['path', 'fs', ...]
    }),
    react(),
  ],
  base: "/push-wallet/",
});
