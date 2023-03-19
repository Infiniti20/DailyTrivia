import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, type UserConfigExport } from "vite";
import fs from "fs";

import path from "path";

function excludeNodeModules() {
  return {
    name: "exclude-node-modules",
    resolveId(source:any) {
      if (/\.(node)$/.test(source)) {
        return path.resolve(__dirname, `src/client/dummy-${source}`);
      }
      return null;
    },
    load(id:any) {
      if (/src\/client\/dummy-(.*)/.test(id)) {
        return `export default {};`;
      }
      return null;
    },
  };
}



function rawFonts(ext: any[]) {
  return {
    name: "vite-plugin-raw-fonts",
    transform(code: any, id: any) {
      if (ext.some((e) => id.endsWith(e))) {
        const buffer = fs.readFileSync(id);
        return { code: `export default ${JSON.stringify(buffer)}`, map: null };
      }
    },
  };

};
const config: UserConfigExport = {
  plugins: [
    sveltekit(),
    rawFonts([".ttf"]),
  ],
  optimizeDeps: { exclude: ["fsevents"] },
  build: {
    rollupOptions: {
      external: ["@resvg/resvg-js"],
      output: {
        globals: { "@resvg/resvg-js": "Resvg" },
      },
    },
  },
};
export default defineConfig(config);
