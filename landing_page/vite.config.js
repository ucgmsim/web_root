import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: Number(process.env.PORT) || 3000 },
  // Keep the CRA output folder so existing deployment steps still work
  build: { outDir: "build" },
});
