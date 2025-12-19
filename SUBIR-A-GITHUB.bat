@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   SUBIR CODIGO A GITHUB
echo ========================================
echo.
echo Repositorio: https://github.com/Abdeel57/RIFASDELASUERTE.git
echo.

REM Verificar si Git esta instalado
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git no esta instalado.
    echo.
    echo Por favor instala Git desde: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [1/6] Verificando Git...
git --version
echo.

echo [2/6] Inicializando repositorio Git...
if exist .git (
    echo    [OK] Git ya esta inicializado
) else (
    git init
    echo    [OK] Git inicializado
)
echo.

echo [3/6] Configurando remote...
git remote remove origin 2>nul
git remote add origin https://github.com/Abdeel57/RIFASDELASUERTE.git
echo    [OK] Remote configurado
echo.

echo [4/6] Agregando archivos...
git add .
echo    [OK] Archivos agregados
echo.

echo [5/6] Creando commit...
git commit -m "Initial commit: Sistema de Rifas completo con backend NestJS y frontend React"
if %ERRORLEVEL% EQU 0 (
    echo    [OK] Commit creado
) else (
    echo    [AVISO] No hay cambios nuevos para commitear
)
echo.

echo [6/6] Subiendo a GitHub...
echo.
echo IMPORTANTE: Si te pide autenticacion:
echo - Usuario: Tu usuario de GitHub (Abdeel57)
echo - Contrasena: Usa un Personal Access Token (NO tu contrasena)
echo.
echo Para crear un token:
echo 1. Ve a: https://github.com/settings/tokens
echo 2. Generate new token (classic)
echo 3. Selecciona permisos: repo (todos)
echo 4. Copia el token y usalo como contrasena
echo.
pause

git branch -M main
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   [OK] CODIGO SUBIDO EXITOSAMENTE
    echo ========================================
    echo.
    echo Puedes ver tu codigo en:
    echo https://github.com/Abdeel57/RIFASDELASUERTE
    echo.
) else (
    echo.
    echo ========================================
    echo   [ERROR] HUBO UN PROBLEMA
    echo ========================================
    echo.
    echo Posibles causas:
    echo 1. Problemas de autenticacion (usa Personal Access Token)
    echo 2. El repositorio no existe o no tienes permisos
    echo 3. Problemas de conexion
    echo.
    echo Revisa la guia: SUBIR-CODIGO-A-GITHUB.md
    echo.
)

pause

