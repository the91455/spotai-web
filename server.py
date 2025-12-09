import http.server
import socketserver
import os
import json

PORT = 8080

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # API endpoint to get configuration from .env
        if self.path == '/api/config':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            api_key = ""
            # Manually parse .env to avoid 'python-dotenv' dependency
            if os.path.exists('.env'):
                try:
                    with open('.env', 'r') as f:
                        for line in f:
                            line = line.strip()
                            if line.startswith('GEMINI_API_KEY='):
                                # Split by first = and strip quotes
                                api_key = line.split('=', 1)[1].strip().strip('"').strip("'")
                                break
                except Exception as e:
                    print(f"Error reading .env: {e}")
            
            response = {"apiKey": api_key}
            self.wfile.write(json.dumps(response).encode())
            
        else:
            # Serve static files as usual
            return http.server.SimpleHTTPRequestHandler.do_GET(self)

if __name__ == "__main__":
    # Allow address reuse to avoid "Address already in use" errors on restart
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
        finally:
            httpd.server_close()
