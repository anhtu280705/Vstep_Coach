@echo off
title VSTEP B1-B2 Personal Learning App
cd /d "%~dp0"
echo Dang khoi dong ung dung on thi VSTEP B1-B2...
echo Trinh duyet se tu mo tai http://localhost:5173
start "" "http://localhost:5173"
call npm.cmd run dev -- --port 5173
pause
