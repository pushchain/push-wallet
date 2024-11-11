import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { nodePolyfills } from "vite-plugin-node-polyfills";
// import { getAppBasePath } from "./src/common";
// import { resolve } from "path";
// import viteTsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nodePolyfills({
      // You can add options here if needed
      // For example, enable specific polyfills
      // include: ['path', 'fs', ...]
    }),
    react(),
    // viteTsconfigPaths({
    //   root: "./src",
    // }),
  ],
  // resolve: {
  //   alias: {
  //     // Define your alias here
  //     blocks: resolve(__dirname, "src/blocks"),
  //     common: resolve(__dirname, "src/common"),
  //   },
  // },
  base: '/',
});
