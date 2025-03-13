<<<<<<< HEAD
<<<<<<< HEAD
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
=======
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
>>>>>>> alpha
=======
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
>>>>>>> d499f1d (Initial commit)

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
<<<<<<< HEAD
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
=======
      '/api/': {
        target: 'https://agrowteinlabs.onrender.com',
        changeOrigin: true,
      }
    }
  }
>>>>>>> d499f1d (Initial commit)
});
