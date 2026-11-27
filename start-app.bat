@echo off
title VSTEP B1-B2 Personal Coach
cd /d "%~dp0"
if not exist "node_modules" (
  echo Lan dau chay: dang cai dat thu vien can thiet...
  call npm.cmd install
)
echo Dang khoi dong ung dung on thi VSTEP B1-B2...
echo Trinh duyet se tu mo tai http://localhost:5173
start "" "http://localhost:5173"
call npm.cmd run dev -- --port 5173
pause
