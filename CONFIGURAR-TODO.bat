@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   CONFIGURACION AUTOMATICA
echo ========================================
echo.

REM Verificar si Node.js esta disponible
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js no esta instalado o no esta en el PATH
    echo.
    echo Por favor instala Node.js primero:
    echo 1. Ejecuta: INSTALAR-NODEJS.bat
    echo 2. O descarga desde: https://nodejs.org/
    echo.
    echo Despues de instalar, reinicia esta terminal y vuelve a intentar.
    echo.
    pause
    exit /b 1
)

powershell -ExecutionPolicy Bypass -File "%~dp0CONFIGURAR-TODO.ps1"
pause

