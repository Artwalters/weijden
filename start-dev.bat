@echo off
title Weijden Multicare Development Server

echo 🚀 Starting Weijden Multicare Development Server...
echo 📁 Directory: %cd%
echo 🌐 Server will be available at: http://localhost:8080
echo 🔄 Auto-reload enabled - browser will refresh on file changes
echo.
echo Press Ctrl+C to stop the server
echo ----------------------------------------

REM Start live-server with custom configuration
live-server --port=8080 --host=0.0.0.0 --no-browser --watch="css,js,pages,assets" --wait=500 --ignore="node_modules,*.log,*.tmp"