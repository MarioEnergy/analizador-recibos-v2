#!/bin/bash
# 🚀 Energy Saver Costa Rica - Quick Start Script
# Starts the HTTP server for the HTML interface

echo "🚀 Energy Saver Costa Rica - Starting HTTP Server..."
echo "=================================================="

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    python3 start_server.py
elif command -v python &> /dev/null; then
    python start_server.py
else
    echo "❌ Python is not installed or not in PATH"
    echo "Please install Python 3 to run the server"
    exit 1
fi