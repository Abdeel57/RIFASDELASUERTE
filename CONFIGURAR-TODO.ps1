# Script PowerShell para configurar todo automaticamente
# RIFAS DE LA SUERTE

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CONFIGURACION AUTOMATICA" -ForegroundColor Cyan
Write-Host "  RIFAS DE LA SUERTE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Crear archivo .env
Write-Host "[1/6] Creando archivo backend/.env..." -ForegroundColor Yellow

# Construir el contenido del archivo .env linea por linea
$envLines = @()
$envLines += "# Variables de Entorno - RIFAS DE LA SUERTE"
$envLines += "# Configurado automaticamente"
$envLines += ""
$envLines += "# Base de Datos PostgreSQL"
$envLines += 'DATABASE_URL="postgresql://postgres:xByilLeCmQsaDXhbyzetJcoEMiuVBfUO@shinkansen.proxy.rlwy.net:47107/railway"'
$envLines += ""
$envLines += "# Configuracion del Servidor"
$envLines += "NODE_ENV=development"
$envLines += "PORT=3000"
$envLines += ""
$envLines += "# Seguridad - JWT Secret"
$envLines += 'JWT_SECRET="a7f3b9c2d8e1f4a6b5c9d2e7f1a4b8c3d6e9f2a5b8c1d4e7f0a3b6c9d2e5f8a1b4"'
$envLines += ""
$envLines += "# Dominio del cliente (configurar cuando tengas dominio)"
$envLines += 'CLIENT_DOMAIN=""'
$envLines += ""
$envLines += "# CORS (URLs permitidas separadas por comas)"
$envLines += "CORS_ORIGINS=http://localhost:5173,http://localhost:3001"

$envContent = $envLines -join "`r`n"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$envPath = Join-Path $scriptDir "backend\.env"

# Crear backup si existe
if (Test-Path $envPath) {
    $backupPath = "$envPath.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Copy-Item $envPath $backupPath
    Write-Host "   [AVISO] Archivo .env existente respaldado" -ForegroundColor Yellow
}

Set-Content -Path $envPath -Value $envContent -Encoding UTF8
Write-Host "   [OK] Archivo .env creado" -ForegroundColor Green
Write-Host ""

# Paso 2: Verificar Node.js
Write-Host "[2/6] Verificando Node.js..." -ForegroundColor Yellow

# Buscar Node.js en todas las ubicaciones posibles
$nodeExe = $null
$nodePaths = @(
    "node",  # Intentar primero desde PATH
    "$env:ProgramFiles\nodejs\node.exe",
    "${env:ProgramFiles(x86)}\nodejs\node.exe",
    "$env:LOCALAPPDATA\Programs\nodejs\node.exe",
    "$env:APPDATA\npm\node.exe",
    "C:\Program Files\nodejs\node.exe",
    "C:\Program Files (x86)\nodejs\node.exe"
)

foreach ($path in $nodePaths) {
    if ($path -eq "node") {
        # Intentar ejecutar directamente
        $result = & cmd /c "where node" 2>$null
        if ($LASTEXITCODE -eq 0 -and $result) {
            $nodeExe = $result[0]
            break
        }
    } else {
        if (Test-Path $path) {
            $nodeExe = $path
            # Agregar al PATH temporalmente
            $nodeDir = Split-Path $path -Parent
            if ($env:Path -notlike "*$nodeDir*") {
                $env:Path = "$nodeDir;$env:Path"
            }
            break
        }
    }
}

if ($null -eq $nodeExe) {
    Write-Host "   [ERROR] Node.js no encontrado." -ForegroundColor Red
    Write-Host "   Por favor instalalo desde: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "   O asegurate de que este en el PATH del sistema" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Si ya esta instalado, reinicia la terminal y vuelve a intentar." -ForegroundColor Cyan
    exit 1
}

# Verificar que funciona
try {
    # Actualizar PATH para incluir Node.js
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    # Intentar ejecutar node directamente
    $nodeVersion = & node --version 2>&1
    if ($LASTEXITCODE -ne 0 -and $nodeVersion -like "*error*") {
        throw "Error ejecutando Node.js"
    }
    Write-Host "   [OK] Node.js encontrado: $nodeVersion" -ForegroundColor Green
    if ($nodeExe -and $nodeExe -ne "node") {
        Write-Host "   Ubicacion: $nodeExe" -ForegroundColor Gray
    }
} catch {
    Write-Host "   [ERROR] No se pudo ejecutar Node.js" -ForegroundColor Red
    Write-Host "   Intenta reiniciar la terminal y ejecutar de nuevo" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Paso 3: Instalar dependencias del backend
Write-Host "[3/6] Instalando dependencias del backend..." -ForegroundColor Yellow
$backendPath = Join-Path $scriptDir "backend"
Push-Location $backendPath
if (-not (Test-Path "node_modules")) {
    Write-Host "   Instalando dependencias..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   [ERROR] Error al instalar dependencias" -ForegroundColor Red
        Pop-Location
        exit 1
    }
} else {
    Write-Host "   [OK] Dependencias ya instaladas" -ForegroundColor Green
}
Pop-Location
Write-Host ""

# Paso 4: Generar cliente Prisma
Write-Host "[4/6] Generando cliente Prisma..." -ForegroundColor Yellow
Push-Location $backendPath
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "   [ERROR] Error al generar Prisma" -ForegroundColor Red
    Pop-Location
    exit 1
}
Write-Host "   [OK] Cliente Prisma generado" -ForegroundColor Green
Pop-Location
Write-Host ""

# Paso 5: Ejecutar migraciones
Write-Host "[5/6] Ejecutando migraciones de base de datos..." -ForegroundColor Yellow
Push-Location $backendPath
Write-Host "   Esto puede tardar unos segundos..." -ForegroundColor Cyan
npm run migrate:deploy
if ($LASTEXITCODE -ne 0) {
    Write-Host "   [ERROR] Error al ejecutar migraciones" -ForegroundColor Red
    Write-Host "   Verifica que la base de datos este accesible" -ForegroundColor Yellow
    Pop-Location
    exit 1
}
Write-Host "   [OK] Migraciones ejecutadas" -ForegroundColor Green
Pop-Location
Write-Host ""

# Paso 6: Crear usuario administrador
Write-Host "[6/6] Creando usuario administrador..." -ForegroundColor Yellow
Push-Location $backendPath
$scriptPath = Join-Path "scripts" "create-admin-user.js"
node $scriptPath admin "Rifas2024!Admin#Seguro" admin@rifasdelasuerte.com "Administrador Principal"
if ($LASTEXITCODE -ne 0) {
    Write-Host "   [AVISO] Error al crear usuario (puede que ya exista)" -ForegroundColor Yellow
} else {
    Write-Host "   [OK] Usuario administrador creado" -ForegroundColor Green
}
Pop-Location
Write-Host ""

# Resumen final
Write-Host "========================================" -ForegroundColor Green
Write-Host "  [OK] CONFIGURACION COMPLETADA" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Credenciales de acceso:" -ForegroundColor Cyan
Write-Host "   URL: http://localhost:5173/#/admin" -ForegroundColor White
Write-Host "   Usuario: admin" -ForegroundColor White
Write-Host "   Contrasena: Rifas2024!Admin#Seguro" -ForegroundColor White
Write-Host ""
Write-Host "Proximos pasos:" -ForegroundColor Cyan
Write-Host "   1. Inicia la aplicacion: npm start" -ForegroundColor White
Write-Host "   2. Accede al panel admin con las credenciales arriba" -ForegroundColor White
Write-Host "   3. Configura tu sitio desde el panel" -ForegroundColor White
Write-Host ""
Write-Host "Todo listo para RIFAS DE LA SUERTE!" -ForegroundColor Green
Write-Host ""
