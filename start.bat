@echo off
REM 🚀 Energy Saver Costa Rica - Quick Start Script (Windows)
REM Starts the HTTP server for the HTML interface

echo 🚀 Energy Saver Costa Rica - Starting HTTP Server...
echo ==================================================

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    python start_server.py
) else (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3 to run the server
    pause
    exit /b 1
)