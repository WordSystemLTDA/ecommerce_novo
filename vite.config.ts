import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
   server: {
    allowedHosts: [
      'eadsagestart.com.br',
      'https://eadsagestart.com.br',
      'https://eadsagestart.com.br/sistema/apis_restaurantes/api_e_commerce/api1',
      '127.0.0.1',
      'http://127.0.0.1'
    ],
  },
});
