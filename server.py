#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys
from threading import Thread
import time

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)
    
    def end_headers(self):
        # Add headers to prevent caching issues
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def log_message(self, format, *args):
        # Simple logging
        print(f"[{self.address_string()}] {format % args}")

def start_server(port=8009):
    try:
        with socketserver.TCPServer(("", port), CustomHTTPRequestHandler) as httpd:
            httpd.allow_reuse_address = True
            print(f"✅ Server running at http://localhost:{port}")
            print("Press Ctrl+C to stop")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
    except Exception as e:
        print(f"❌ Server error: {e}")
        print("Trying to restart...")
        time.sleep(2)
        start_server(port + 1)

if __name__ == "__main__":
    # Change to the correct directory
    os.chdir('/home/arthur/wijdenmulticare')
    start_server()