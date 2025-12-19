@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   CONTINUAR CONFIGURACION MANUAL
echo ========================================
echo.
echo El archivo .env ya fue creado.
echo Ahora necesitas ejecutar estos comandos manualmente:
echo.
echo 1. Abre una terminal nueva (CMD o PowerShell)
echo 2. Navega a esta carpeta
echo 3. Ejecuta estos comandos en orden:
echo.
echo    cd backend
echo    npm install
echo    npx prisma generate
echo    npm run migrate:deploy
echo    node scripts\create-admin-user.js admin "Rifas2024!Admin#Seguro" admin@rifasdelasuerte.com "Administrador Principal"
echo    cd ..
echo    npm start
echo.
echo ========================================
echo.
echo Si Node.js no funciona, prueba:
echo 1. Reiniciar la terminal
echo 2. O instalar Node.js desde: https://nodejs.org/
echo.
pause

