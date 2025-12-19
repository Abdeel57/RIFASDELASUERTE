# 🚀 Guía Completa de Despliegue a Producción

## 📋 ¿Qué necesitas desplegar?

Para que tu página funcione en la web, necesitas desplegar **AMBOS**:

1. ✅ **Backend** (API) → Railway.app
2. ✅ **Frontend** (Página web) → Netlify.com
3. ✅ **Base de Datos** → Ya está en Railway (según tu .env)

---

## 🎯 Resumen Rápido

### Backend (Railway)
- **Por qué**: El frontend necesita hacer llamadas a la API para:
  - Mostrar rifas
  - Procesar compras
  - Autenticación de admin
  - Gestionar datos
- **Dónde**: Railway.app (gratis para empezar)
- **Tiempo**: 15-20 minutos

### Frontend (Netlify)
- **Por qué**: Es la página que ven los usuarios
- **Dónde**: Netlify.com (gratis)
- **Tiempo**: 10-15 minutos

---

## 🚂 PASO 1: Desplegar Backend en Railway

### 1.1 Crear cuenta y proyecto
1. Ve a: https://railway.app
2. Inicia sesión con GitHub
3. Click en **"New Project"**
4. Selecciona **"Deploy from GitHub repo"**
5. Conecta tu repositorio
6. Selecciona el repo y click **"Deploy Now"**

### 1.2 Configurar el servicio
1. En tu servicio, ve a **Settings**
2. Busca **"Root Directory"** → Cambia a: `backend`
3. **Save**

### 1.3 Variables de entorno
Ve a **Variables** y agrega:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://postgres:xByilLeCmQsaDXhbyzetJcoEMiuVBfUO@shinkansen.proxy.rlwy.net:47107/railway
JWT_SECRET=a7f3b9c2d8e1f4a6b5c9d2e7f1a4b8c3d6e9f2a5b8c1d4e7f0a3b6c9d2e5f8a1b4
CORS_ORIGINS=https://tu-sitio.netlify.app
```

**Nota**: Reemplaza `https://tu-sitio.netlify.app` con la URL real de tu frontend (la obtendrás después).

### 1.4 Configurar dominio público
1. En tu servicio → **Settings** → **Networking**
2. Click en **"Generate Domain"**
3. Railway te dará: `https://tu-backend.up.railway.app`
4. **Copia esta URL** - la necesitarás para el frontend

### 1.5 Ejecutar migraciones
1. En Railway → Tu servicio → **Settings** → **Deploy**
2. Busca **"Run Command"** o **"One-off Command"**
3. Ejecuta:
   ```bash
   cd backend && npx prisma migrate deploy
   ```

### 1.6 Verificar
Abre en tu navegador:
```
https://tu-backend.up.railway.app/api/health
```

Deberías ver:
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": ...
}
```

---

## 🌐 PASO 2: Desplegar Frontend en Netlify

### 2.1 Crear cuenta y proyecto
1. Ve a: https://netlify.com
2. Inicia sesión con GitHub
3. Click en **"Add new site"** → **"Import an existing project"**
4. Conecta tu repositorio
5. Selecciona el repo

### 2.2 Configurar build
En la configuración de build:

- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/dist`

### 2.3 Variables de entorno
En **Site settings** → **Environment variables**, agrega:

```
VITE_API_URL=https://tu-backend.up.railway.app/api
```

**Nota**: Reemplaza con la URL real de tu backend de Railway.

### 2.4 Desplegar
1. Click en **"Deploy site"**
2. Netlify construirá y desplegará tu sitio
3. Te dará una URL como: `https://tu-sitio.netlify.app`

### 2.5 Actualizar CORS en Backend
Ahora que tienes la URL de Netlify, vuelve a Railway:

1. Ve a **Variables** de tu backend
2. Actualiza `CORS_ORIGINS`:
   ```
   CORS_ORIGINS=https://tu-sitio.netlify.app
   ```
3. Railway redeployará automáticamente

---

## ✅ PASO 3: Verificar Todo Funciona

### Backend
- ✅ Health check: `https://tu-backend.up.railway.app/api/health`
- ✅ Debe responder con `{"status": "ok"}`

### Frontend
- ✅ Abre: `https://tu-sitio.netlify.app`
- ✅ Debe cargar la página
- ✅ Panel admin: `https://tu-sitio.netlify.app/#/admin`

### Probar funcionalidad
1. Accede al panel admin
2. Inicia sesión con:
   - Usuario: `admin`
   - Contraseña: `Rifas2024!Admin#Seguro`
3. Verifica que puedas ver el dashboard

---

## 🔄 Actualizaciones Futuras

### Cuando hagas cambios:

**Backend:**
- Haz `git push` a tu repositorio
- Railway desplegará automáticamente

**Frontend:**
- Haz `git push` a tu repositorio
- Netlify desplegará automáticamente

---

## 🆘 Problemas Comunes

### El frontend no se conecta al backend
- Verifica que `VITE_API_URL` esté correcta en Netlify
- Verifica que `CORS_ORIGINS` incluya tu URL de Netlify
- Verifica que el backend esté activo en Railway

### Error de CORS
- Asegúrate de que `CORS_ORIGINS` en Railway tenga la URL exacta de Netlify
- Sin "/" al final
- Con "https://"

### El backend no inicia
- Revisa los logs en Railway
- Verifica que `DATABASE_URL` sea correcta
- Verifica que las migraciones se hayan ejecutado

---

## 📊 Resumen de URLs

Después del despliegue tendrás:

- **Backend API**: `https://tu-backend.up.railway.app`
- **Frontend**: `https://tu-sitio.netlify.app`
- **Panel Admin**: `https://tu-sitio.netlify.app/#/admin`

---

## 💰 Costos

- **Railway**: Gratis hasta cierto límite (suficiente para empezar)
- **Netlify**: Gratis (plan básico)
- **Base de datos**: Ya está en Railway (incluida)

---

## ✅ Checklist Final

- [ ] Backend desplegado en Railway
- [ ] Variables de entorno configuradas en Railway
- [ ] Migraciones ejecutadas
- [ ] Dominio público del backend obtenido
- [ ] Frontend desplegado en Netlify
- [ ] Variable `VITE_API_URL` configurada en Netlify
- [ ] CORS actualizado con URL de Netlify
- [ ] Health check del backend funciona
- [ ] Frontend carga correctamente
- [ ] Panel admin accesible

---

¡Listo! Tu página estará en línea. 🎉

