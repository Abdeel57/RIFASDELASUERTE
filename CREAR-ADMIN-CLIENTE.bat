@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   CREAR USUARIO ADMINISTRADOR
echo   RIFAS DE LA SUERTE
echo ========================================
echo.
echo Creando usuario administrador...
echo.
echo Usuario: admin
echo Email: admin@rifasdelasuerte.com
echo.
echo ========================================
echo.

node backend\scripts\create-admin-user.js admin Rifas2024!Admin#Seguro admin@rifasdelasuerte.com "Administrador Principal"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   ✓ USUARIO CREADO EXITOSAMENTE
    echo ========================================
    echo.
    echo Credenciales:
    echo   Usuario: admin
    echo   Contraseña: Rifas2024!Admin#Seguro
    echo.
    echo Puedes acceder al panel en:
    echo   http://localhost:5173/#/admin
    echo.
) else (
    echo.
    echo ========================================
    echo   ✗ ERROR AL CREAR USUARIO
    echo ========================================
    echo.
    echo Verifica que:
    echo   1. Las migraciones estén ejecutadas
    echo   2. La base de datos esté conectada
    echo   3. Node.js esté instalado
    echo.
)

echo ========================================
pause

