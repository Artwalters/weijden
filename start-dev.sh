#!/bin/bash

# Weijden Multicare Development Server
# Auto-reload server met live refresh

echo "🚀 Starting Weijden Multicare Development Server..."
echo "📁 Directory: $(pwd)"
echo "🌐 Server will be available at: http://localhost:8080"
echo "🔄 Auto-reload enabled - browser will refresh on file changes"
echo ""
echo "Press Ctrl+C to stop the server"
echo "----------------------------------------"

# Start live-server met custom configuratie
live-server \
  --port=8080 \
  --host=0.0.0.0 \
  --no-browser \
  --watch="css,js,pages,assets" \
  --wait=500 \
  --ignore="node_modules,*.log,*.tmp"