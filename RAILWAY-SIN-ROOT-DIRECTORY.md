# ✅ Railway SIN Root Directory - Guía Rápida

## 🎯 No Encontraste Root Directory? ¡No Hay Problema!

Tu proyecto **YA ESTÁ CONFIGURADO** para funcionar sin Root Directory.

---

## ✅ Por Qué Funciona Sin Root Directory

Tu archivo `railway.json` ya tiene los comandos correctos:

```json
{
  "build": {
    "buildCommand": "cd backend && npm install && npx prisma generate && npx nest build"
  },
  "deploy": {
    "startCommand": "cd backend && npm run start:prod"
  }
}
```

El `cd backend` al inicio de cada comando hace que Railway entre a la carpeta `backend` antes de ejecutar los comandos.

---

## 🚀 Qué Hacer Ahora

### 1. Verifica Build Command (Opcional)

1. En Railway, ve a tu servicio
2. Click en **"Settings"**
3. Busca **"Build & Deploy"** o **"Deploy"**
4. Verifica que los comandos tengan `cd backend` al inicio

**Si ya tienen `cd backend`, está perfecto. No necesitas hacer nada más.**

### 2. Configura Variables de Entorno

Esto SÍ es necesario. Ve a **"Variables"** y agrega:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://postgres:xByilLeCmQsaDXhbyzetJcoEMiuVBfUO@shinkansen.proxy.rlwy.net:47107/railway
JWT_SECRET=a7f3b9c2d8e1f4a6b5c9d2e7f1a4b8c3d6e9f2a5b8c1d4e7f0a3b6c9d2e5f8a1b4
CORS_ORIGINS=https://tu-sitio.netlify.app
```

### 3. Deja que Railway Haga el Deploy

Railway debería:
1. Leer tu `railway.json`
2. Usar los comandos con `cd backend`
3. Construir y desplegar automáticamente

---

## 🔍 Dónde Está Root Directory (Si Quieres Buscarlo)

Railway cambia su interfaz frecuentemente. Puede estar en:

1. **Settings** → **"Service Settings"** → **"Root Directory"**
2. **Settings** → **"Build & Deploy"** → **"Advanced"** → **"Root Directory"**
3. **Settings** → **"Configuration"** → **"Source"** → **"Root Directory"**

**Pero NO ES NECESARIO** si tus comandos ya tienen `cd backend`.

---

## ✅ Verificación

Después del deploy, revisa los logs:

1. Ve a **"Deployments"**
2. Click en el último deployment
3. Revisa los logs

**Si ves:**
- `cd backend` ejecutándose
- `npm install` en la carpeta backend
- `npx prisma generate` ejecutándose
- `npm run start:prod` iniciando

**Entonces está funcionando correctamente** sin Root Directory.

---

## 🆘 Si Hay Errores

Si el deploy falla y dice "Cannot find module" o "package.json not found":

1. Verifica que el **Build Command** tenga `cd backend` al inicio
2. Si no lo tiene, agrégalo manualmente
3. O busca Root Directory en Settings (puede estar en una ubicación diferente)

---

## 📝 Resumen

- ✅ **NO necesitas Root Directory** si los comandos tienen `cd backend`
- ✅ **SÍ necesitas** configurar Variables de Entorno
- ✅ **SÍ necesitas** generar dominio público
- ✅ **SÍ necesitas** ejecutar migraciones

**Continúa con el siguiente paso: Configurar Variables de Entorno**

