import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
  define: {
    "import.meta.env.VERCEL": JSON.stringify(process.env.VERCEL),
    "import.meta.env.BASIC_INFO_API_URL": JSON.stringify(
      process.env.BASIC_INFO_API_URL
    ),
    "import.meta.env.DETAILS_API_URL": JSON.stringify(
      process.env.DETAILS_API_URL
    ),
  },
});
