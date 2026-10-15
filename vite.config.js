import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: 'serve-scenes-folder',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const urlPath = decodeURIComponent(req.url.split('?')[0]);
          if (urlPath.startsWith('/Scenes/') || urlPath.startsWith('/scenes/')) {
            const relFile = urlPath.replace(/^\/(Scenes|scenes)\//i, '');
            const filePath = path.join(__dirname, 'Scenes', relFile);
            
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              const ext = path.extname(filePath).toLowerCase();
              const mimeTypes = {
                '.mp4': 'video/mp4',
                '.webm': 'video/webm',
                '.ogg': 'video/ogg',
                '.mov': 'video/quicktime',
                '.mkv': 'video/x-matroska',
                '.mp3': 'audio/mpeg',
                '.wav': 'audio/wav',
                '.m4a': 'audio/mp4',
              };
              
              const stat = fs.statSync(filePath);
              const range = req.headers.range;
              
              if (range) {
                const parts = range.replace(/bytes=/, '').split('-');
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
                res.writeHead(206, {
                  'Content-Range': `bytes ${start}-${end}/${stat.size}`,
                  'Accept-Ranges': 'bytes',
                  'Content-Length': (end - start) + 1,
                  'Content-Type': mimeTypes[ext] || 'video/mp4',
                });
                fs.createReadStream(filePath, { start, end }).pipe(res);
              } else {
                res.writeHead(200, {
                  'Content-Length': stat.size,
                  'Content-Type': mimeTypes[ext] || 'video/mp4',
                  'Accept-Ranges': 'bytes',
                });
                fs.createReadStream(filePath).pipe(res);
              }
              return;
            }
          }
          next();
        });
      }
    }
  ],
  server: {
    port: 5173,
    open: false,
    host: true
  }
});
