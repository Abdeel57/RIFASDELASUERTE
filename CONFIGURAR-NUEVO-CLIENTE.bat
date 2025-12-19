@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   CONFIGURACIÓN DE NUEVO CLIENTE
echo ========================================
echo.
echo Este script te guiará para configurar
echo la página para un cliente nuevo.
echo.
pause

node scripts\setup-new-client.js

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   CONFIGURACIÓN COMPLETADA
    echo ========================================
    echo.
    echo Revisa los próximos pasos arriba.
    echo.
) else (
    echo.
    echo ========================================
    echo   ERROR EN LA CONFIGURACIÓN
    echo ========================================
    echo.
    echo Hubo un error. Verifica que Node.js
    echo esté instalado y en el PATH.
    echo.
)

pause

