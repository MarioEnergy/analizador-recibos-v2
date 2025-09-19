#!/usr/bin/env python3
"""
🚀 Energy Saver Costa Rica - HTTP Server Launcher
Starts the HTML interface on a local HTTP server

Usage:
    python3 start_server.py [port]
    
Default port: 8000
"""

import http.server
import socketserver
import os
import sys
import webbrowser
from threading import Timer

def main():
    # Get port from command line argument or use default
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    
    # Change to the directory containing the HTML files
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Create server
    handler = http.server.SimpleHTTPRequestHandler
    
    # Add custom headers to fix CORS issues
    class CustomHTTPRequestHandler(handler):
        def send_response(self, code, message=None):
            super().send_response(code, message)
            if self.path.endswith('.js'):
                self.send_header('Content-Type', 'application/javascript')
            elif self.path.endswith('.css'):
                self.send_header('Content-Type', 'text/css')
            # Allow cross-origin requests for CDN resources
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
    
    # Start server
    with socketserver.TCPServer(("", port), CustomHTTPRequestHandler) as httpd:
        server_url = f"http://localhost:{port}"
        
        print("🚀 Energy Saver Costa Rica - HTTP Server")
        print("=" * 50)
        print(f"📡 Server running at: {server_url}")
        print(f"📁 Serving files from: {os.getcwd()}")
        print()
        print("📋 Available Pages:")
        print(f"   🏠 Main Interface:     {server_url}/index.html")
        print(f"   📊 Dashboard:          {server_url}/dashboard.html")
        print(f"   🎁 Referrals:          {server_url}/referrals-dashboard.html")
        print()
        print("✅ HTTP server is ready!")
        print("Press Ctrl+C to stop the server")
        print("=" * 50)
        
        # Auto-open browser after 2 seconds
        def open_browser():
            webbrowser.open(f"{server_url}/index.html")
        
        Timer(2.0, open_browser).start()
        
        # Start serving
        httpd.serve_forever()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n👋 Server stopped. Goodbye!")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)