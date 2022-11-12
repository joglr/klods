import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Klods",
        short_name: "Klods",
        start_url: "/",
        display: "standalone",
        theme_color: "#00cc00",
        icons: [
          {
            src: "/icons/klods-64x.png",
            sizes: "64x64",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/klods-128x.png",
            sizes: "128x128",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/klods-192x.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/klods-256x.png",
            sizes: "256x256",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/klods-512x.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
        ],
      },
    }),
  ],
});
