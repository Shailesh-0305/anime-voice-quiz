@echo off
title Anime Scene Voice Quiz
cls
echo ===============================================================
echo            ANIME SCENE VOICE QUIZ - LOCAL SERVER
echo ===============================================================
echo.
echo Video scenes loaded from: Scenes folder
echo Starting local server at: http://localhost:5173
echo.

where python >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo Using Python server to serve production build with scene streaming...
    start http://localhost:5173
    python server.py
) else (
    echo Python not found, launching with Vite dev server...
    start http://localhost:5173
    npm run dev
)
pause
