import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["3fdf9d68db55.ngrok-free.app"], // 👈 allow your ngrok domain
    host: true, // 👈 allow external access (required for mobile testing)
  },
});
