# Script para instalar Node.js automaticamente usando winget
# Requiere Windows 10/11 con winget instalado

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INSTALACION AUTOMATICA DE NODE.JS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si winget esta disponible
$winget = Get-Command winget -ErrorAction SilentlyContinue

if ($null -eq $winget) {
    Write-Host "[ERROR] winget no esta disponible." -ForegroundColor Red
    Write-Host ""
    Write-Host "Opciones:" -ForegroundColor Yellow
    Write-Host "1. Instalar manualmente desde: https://nodejs.org/" -ForegroundColor White
    Write-Host "2. Instalar winget desde Microsoft Store" -ForegroundColor White
    Write-Host ""
    Write-Host "Presiona cualquier tecla para abrir el sitio de Node.js..." -ForegroundColor Cyan
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    Start-Process "https://nodejs.org/"
    exit 1
}

Write-Host "[INFO] winget encontrado. Instalando Node.js LTS..." -ForegroundColor Yellow
Write-Host ""

try {
    # Instalar Node.js LTS usando winget
    winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "[OK] Node.js instalado correctamente!" -ForegroundColor Green
        Write-Host ""
        Write-Host "IMPORTANTE:" -ForegroundColor Yellow
        Write-Host "1. Cierra esta ventana" -ForegroundColor White
        Write-Host "2. Abre una NUEVA terminal (PowerShell o CMD)" -ForegroundColor White
        Write-Host "3. Ejecuta: node --version (para verificar)" -ForegroundColor White
        Write-Host "4. Ejecuta: CONFIGURAR-TODO.bat" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host "[ERROR] Error durante la instalacion" -ForegroundColor Red
        Write-Host "Intenta instalar manualmente desde: https://nodejs.org/" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[ERROR] Error: $_" -ForegroundColor Red
    Write-Host "Intenta instalar manualmente desde: https://nodejs.org/" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

