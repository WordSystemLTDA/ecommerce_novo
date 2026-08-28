import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";

const root = path.resolve(process.cwd(), "build", "client");
const port = Number(process.env.PORT || 3000);
const mimeTypes = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
};

function resolveRequestFile(requestUrl) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(requestUrl || "/", "http://localhost").pathname);
  } catch {
    return null;
  }

  const requestedPath = path.resolve(root, `.${pathname}`);
  if (requestedPath !== root && !requestedPath.startsWith(`${root}${path.sep}`)) return null;

  if (existsSync(requestedPath)) {
    const stats = statSync(requestedPath);
    if (stats.isFile()) return requestedPath;
    if (stats.isDirectory()) {
      const directoryIndex = path.join(requestedPath, "index.html");
      if (existsSync(directoryIndex)) return directoryIndex;
    }
  }

  return path.join(root, "index.html");
}

const server = createServer((request, response) => {
  const filePath = resolveRequestFile(request.url);
  if (!filePath || !existsSync(filePath)) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Página não encontrada");
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  const isVersionedAsset = filePath.includes(`${path.sep}assets${path.sep}`);
  response.writeHead(200, {
    "Content-Type": mimeTypes[extension] || "application/octet-stream",
    "Cache-Control": isVersionedAsset
      ? "public, max-age=31536000, immutable"
      : extension === ".html"
        ? "public, max-age=300"
        : "public, max-age=604800",
    "X-Content-Type-Options": "nosniff",
  });
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  createReadStream(filePath).pipe(response);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Loja disponível na porta ${port}`);
});
