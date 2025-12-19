@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   INSTALACION DE NODE.JS
echo ========================================
echo.
echo Node.js no esta instalado en tu sistema.
echo.
echo OPCIONES:
echo.
echo 1. INSTALACION AUTOMATICA (Recomendado)
echo    - Abre tu navegador y ve a: https://nodejs.org/
echo    - Descarga la version LTS (Long Term Support)
echo    - Ejecuta el instalador
echo    - Asegurate de marcar "Add to PATH" durante la instalacion
echo    - Reinicia la terminal despues de instalar
echo.
echo 2. INSTALACION CON CHOCOLATEY (Si lo tienes)
echo    - Abre PowerShell como Administrador
echo    - Ejecuta: choco install nodejs-lts
echo.
echo 3. INSTALACION CON WINGET (Windows 10/11)
echo    - Abre PowerShell
echo    - Ejecuta: winget install OpenJS.NodeJS.LTS
echo.
echo ========================================
echo.
echo Despues de instalar Node.js:
echo 1. Cierra esta ventana
echo 2. Abre una NUEVA terminal
echo 3. Ejecuta: node --version (para verificar)
echo 4. Ejecuta: CONFIGURAR-TODO.bat
echo.
pause

