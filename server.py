import http.server
import socketserver
import os
import re
import urllib.parse
import webbrowser

PORT = 5173
DIST_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dist')
SCENES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'Scenes')

class CustomRangeHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)

    def translate_path(self, path):
        # Decode and normalize path
        clean_path = urllib.parse.unquote(path.split('?')[0])
        
        # Check if requesting /Scenes/... or /scenes/...
        if clean_path.lower().startswith('/scenes/'):
            sub_path = clean_path[8:] # strip /scenes/
            return os.path.join(SCENES_DIR, sub_path.replace('/', os.sep))
            
        return super().translate_path(path)

    def do_HEAD(self):
        f = self.send_head()
        if f:
            f.close()

    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            parts = urllib.parse.urlsplit(self.path)
            if not parts.path.endswith('/'):
                self.send_response(301)
                new_parts = (parts[0], parts[1], parts[2] + '/', parts[3], parts[4])
                new_url = urllib.parse.urlunsplit(new_parts)
                self.send_header("Location", new_url)
                self.end_headers()
                return None
            for index in "index.html", "index.htm":
                index_path = os.path.join(path, index)
                if os.path.exists(index_path):
                    path = index_path
                    break

        ctype = self.guess_type(path)
        try:
            f = open(path, 'rb')
        except OSError:
            self.send_error(404, "File not found")
            return None

        fs = os.fstat(f.fileno())
        size = fs.st_size

        # Handle Range header for video streaming
        range_header = self.headers.get('Range')
        if range_header:
            match = re.search(r'bytes=(\d+)-(\d*)', range_header)
            if match:
                start = int(match.group(1))
                end = int(match.group(2)) if match.group(2) else size - 1
                if start >= size:
                    self.send_error(416, "Requested Range Not Satisfiable")
                    f.close()
                    return None
                
                length = (end - start) + 1
                f.seek(start)
                
                self.send_response(206)
                self.send_header("Content-Type", ctype)
                self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
                self.send_header("Content-Length", str(length))
                self.send_header("Accept-Ranges", "bytes")
                self.end_headers()
                
                # Wrap file with length limit
                class RangeFileWrapper:
                    def __init__(self, fp, remaining):
                        self.fp = fp
                        self.remaining = remaining
                    def read(self, n=-1):
                        if self.remaining <= 0:
                            return b""
                        if n < 0 or n > self.remaining:
                            n = self.remaining
                        data = self.fp.read(n)
                        self.remaining -= len(data)
                        return data
                    def close(self):
                        self.fp.close()
                        
                return RangeFileWrapper(f, length)

        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(size))
        self.send_header("Accept-Ranges", "bytes")
        self.end_headers()
        return f

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CustomRangeHTTPRequestHandler) as httpd:
        print("=======================================================")
        print(f"  [ANIME SCENE QUIZ] Server Running!")
        print(f"  URL: http://localhost:{PORT}")
        print(f"  Scenes Directory: {SCENES_DIR}")
        print("=======================================================")
        httpd.serve_forever()
