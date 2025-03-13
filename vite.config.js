<<<<<<< HEAD
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
=======
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
>>>>>>> alpha

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
<<<<<<< HEAD
      "/api/": {
        target: "https://agrowteinlabs.onrender.com",
        changeOrigin: true,
        secure: false,  // Set to false if using HTTP
        cookieDomainRewrite: 'localhost',
      },
    },
  },
=======
      '/api/': {
        target: 'https://agrowteinlabs.onrender.com',
        changeOrigin: true,
      }
    }
  }
>>>>>>> alpha
});
