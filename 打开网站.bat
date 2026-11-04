@echo off
cd /d "%~dp0"
if not exist "node_modules\astro" (
  echo First launch: installing dependencies...
  call npm.cmd install
  if errorlevel 1 (pause & exit /b 1)
)
start "" "http://localhost:4321/en/"
call npm.cmd run dev -- --host 127.0.0.1
pause
