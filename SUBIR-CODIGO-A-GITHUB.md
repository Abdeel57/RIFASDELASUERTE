# 📤 Subir Código a GitHub - Paso a Paso

## 📋 Tu Repositorio
- **URL**: https://github.com/Abdeel57/RIFASDELASUERTE.git
- **Estado**: Vacío (necesitas subir el código)

---

## 🚀 PASO 1: Inicializar Git (Si no está inicializado)

### 1.1 Abrir Terminal
1. Abre PowerShell o CMD
2. Navega a tu carpeta del proyecto:
   ```bash
   cd "C:\Users\Admin\Desktop\Rifas\SORTEOS DE LA SUERTE PAGINA"
   ```

### 1.2 Inicializar Git
Si no tienes Git inicializado, ejecuta:

```bash
git init
```

### 1.3 Verificar estado
```bash
git status
```

---

## 📝 PASO 2: Crear .gitignore (Si no existe)

Crea un archivo `.gitignore` en la raíz del proyecto con este contenido:

```
# Dependencies
node_modules/
frontend/node_modules/
backend/node_modules/

# Build outputs
dist/
frontend/dist/
backend/dist/
build/

# Environment variables
.env
backend/.env
.env.local
.env.*.local

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Prisma
backend/prisma/migrations/*.sql
!backend/prisma/migrations/*/migration.sql

# Backup files
*.backup
*.bak
backend/backup/
```

---

## ➕ PASO 3: Agregar Archivos

### 3.1 Agregar todos los archivos
```bash
git add .
```

### 3.2 Verificar qué se agregó
```bash
git status
```

Deberías ver todos tus archivos listos para commit.

---

## 💾 PASO 4: Hacer Commit

### 4.1 Crear commit inicial
```bash
git commit -m "Initial commit: Sistema de Rifas completo"
```

O si prefieres un mensaje más descriptivo:
```bash
git commit -m "Initial commit: Sistema de Rifas con backend NestJS y frontend React"
```

---

## 🔗 PASO 5: Conectar con GitHub

### 5.1 Agregar remote
```bash
git remote add origin https://github.com/Abdeel57/RIFASDELASUERTE.git
```

### 5.2 Verificar remote
```bash
git remote -v
```

Deberías ver:
```
origin  https://github.com/Abdeel57/RIFASDELASUERTE.git (fetch)
origin  https://github.com/Abdeel57/RIFASDELASUERTE.git (push)
```

---

## 📤 PASO 6: Subir Código a GitHub

### 6.1 Cambiar a rama main (si es necesario)
```bash
git branch -M main
```

### 6.2 Subir código
```bash
git push -u origin main
```

**⚠️ IMPORTANTE**: Si te pide autenticación:
- Si usas HTTPS, GitHub puede pedirte un **Personal Access Token**
- O puedes usar **GitHub Desktop** para hacerlo más fácil

### 6.3 Si pide usuario y contraseña
GitHub ya no acepta contraseñas. Necesitas:

**Opción A: Personal Access Token**
1. Ve a: https://github.com/settings/tokens
2. Click en **"Generate new token"** → **"Generate new token (classic)"**
3. Dale un nombre: "Rifas de la Suerte"
4. Selecciona permisos: `repo` (todos)
5. Click en **"Generate token"**
6. **COPIA EL TOKEN** (solo se muestra una vez)
7. Cuando Git pida contraseña, usa el token en lugar de la contraseña

**Opción B: GitHub Desktop (Más fácil)**
1. Descarga: https://desktop.github.com/
2. Instala y abre GitHub Desktop
3. File → Add Local Repository
4. Selecciona tu carpeta
5. Click en "Publish repository"
6. Selecciona tu cuenta y el repo
7. Click en "Publish repository"

---

## ✅ PASO 7: Verificar

### 7.1 Verificar en GitHub
1. Ve a: https://github.com/Abdeel57/RIFASDELASUERTE
2. Deberías ver todos tus archivos
3. Ya no debería decir "This repository is empty"

---

## 🎯 Siguiente Paso

Una vez que tu código esté en GitHub:

1. ✅ **Railway**: Conecta el repositorio desde Railway
2. ✅ **Netlify**: Conecta el repositorio desde Netlify

Ambos servicios detectarán automáticamente tu código.

---

## 🆘 Solución de Problemas

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/Abdeel57/RIFASDELASUERTE.git
```

### Error: "Authentication failed"
- Usa un Personal Access Token en lugar de contraseña
- O usa GitHub Desktop

### Error: "Permission denied"
- Verifica que tengas acceso al repositorio
- Verifica que el repositorio exista en GitHub

---

## 📝 Comandos Rápidos (Resumen)

```bash
# Si no tienes Git inicializado
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit: Sistema de Rifas completo"

# Conectar con GitHub
git remote add origin https://github.com/Abdeel57/RIFASDELASUERTE.git

# Subir código
git branch -M main
git push -u origin main
```

---

¡Listo! Una vez que subas el código, podrás vincularlo con Railway y Netlify. 🚀

