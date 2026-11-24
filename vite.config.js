import { readdirSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = dirname(fileURLToPath(import.meta.url));

function findHtmlFiles(directory) {
  const files = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if ([".git", "dist", "node_modules", "partials"].includes(entry.name)) continue;

    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...findHtmlFiles(path));
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(path);
  }

  return files;
}

const input = Object.fromEntries(
  findHtmlFiles(root).map((file) => [
    relative(root, file).split(sep).join("/").replace(/\.html$/, ""),
    file,
  ]),
);

export default defineConfig({
  root,
  base: "./",
  server: { host: "127.0.0.1", port: 5175, strictPort: true },
  publicDir: resolve(root, "src/assets"),
  build: {
    outDir: resolve(root, "dist"),
    emptyOutDir: true,
    rollupOptions: { input },
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          "import",
          "legacy-js-api",
          "global-builtin",
          "color-functions",
          "strict-unary",
        ],
      },
    },
  },
});
