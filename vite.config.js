import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite configuration for the JobFinder app.
// We keep this file minimal on purpose - the react plugin is all we need
// for a standard Create-React-App-like development experience but faster.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
