# ✅ Backend Desplegado - Siguientes Pasos

## 🎉 ¡Felicidades! Tu backend está en Railway

Ahora necesitas completar estos pasos:

---

## ✅ PASO 1: Verificar que el Backend Funciona

### 1.1 Obtener URL del Backend

1. En Railway, ve a tu servicio (backend)
2. Ve a **"Settings"** → **"Networking"** o **"Public Domain"**
3. Deberías ver una URL como:
   ```
   https://tu-backend-production.up.railway.app
   ```
4. **📋 COPIA ESTA URL** - La necesitarás para el frontend

### 1.2 Probar Health Check

1. Abre tu navegador
2. Ve a: `https://tu-backend-production.up.railway.app/api/health`
3. Deberías ver:
   ```json
   {
     "status": "ok",
     "timestamp": "...",
     "uptime": ...
   }
   ```

**✅ Si ves esto, tu backend está funcionando correctamente.**

---

## 🔐 PASO 2: Verificar Variables de Entorno

Asegúrate de que tengas estas variables en Railway:

1. En tu servicio → **"Variables"**
2. Verifica que tengas:
   - ✅ `NODE_ENV=production`
   - ✅ `PORT=3000`
   - ✅ `DATABASE_URL=postgresql://...` (tu URL de base de datos)
   - ✅ `JWT_SECRET=...` (tu secreto)
   - ⚠️ `CORS_ORIGINS` (lo actualizarás después con la URL de Netlify)

---

## 🔄 PASO 3: Ejecutar Migraciones (Si no lo hiciste)

### Opción A: Desde Railway

1. En tu servicio → **"Deployments"**
2. Click en el último deployment
3. Busca **"Run Command"** o **"One-off Command"**
4. Ejecuta:
   ```bash
   cd backend && npx prisma migrate deploy
   ```
5. Espera a que termine

### Opción B: Desde tu máquina local

1. Temporalmente, cambia tu `DATABASE_URL` local a la de Railway
2. Ejecuta:
   ```bash
   cd backend
   npx prisma migrate deploy
   ```

---

## 🌐 PASO 4: Desplegar Frontend en Netlify

Ahora que el backend funciona, despliega el frontend:

### 4.1 Crear Sitio en Netlify

1. Ve a: **https://netlify.com**
2. Inicia sesión (puedes usar GitHub)
3. Click en **"Add new site"** → **"Import an existing project"**
4. Click en **"Deploy with GitHub"**
5. Autoriza Netlify para acceder a GitHub (si es la primera vez)
6. Selecciona tu repositorio: **`Abdeel57/RIFASDELASUERTE`**

### 4.2 Configurar Build Settings

Netlify te mostrará una pantalla de configuración:

**Base directory:**
- Escribe: **`frontend`**

**Build command:**
- Escribe: **`npm run build`**

**Publish directory:**
- Escribe: **`frontend/dist`**

### 4.3 Configurar Variable de Entorno

**ANTES de hacer deploy**, agrega la variable:

1. En la misma pantalla, busca **"Environment variables"** o **"Advanced build settings"**
2. Click en **"New variable"**
3. Agrega:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://tu-backend-production.up.railway.app/api`
     - ⚠️ **Reemplaza** `tu-backend-production.up.railway.app` con la URL real de tu backend de Railway
4. Click en **"Add variable"**

### 4.4 Deploy

1. Revisa que todo esté correcto
2. Click en **"Deploy site"**
3. Espera 3-5 minutos mientras Netlify construye tu sitio

---

## 🔗 PASO 5: Obtener URL de Netlify y Actualizar CORS

### 5.1 Obtener URL de Netlify

Una vez que el deploy termine:

1. Netlify te dará una URL como:
   ```
   https://amazing-site-12345.netlify.app
   ```
2. **📋 COPIA ESTA URL**

### 5.2 Actualizar CORS en Railway

1. Vuelve a Railway → Tu servicio → **"Variables"**
2. Encuentra la variable `CORS_ORIGINS`
3. Si no existe, créala
4. Actualiza el valor con la URL de Netlify:
   ```
   https://amazing-site-12345.netlify.app
   ```
   (Usa tu URL real de Netlify)
5. Click en **"Save"**

**⚠️ IMPORTANTE**: 
- Sin "/" al final
- Con "https://"
- Railway redeployará automáticamente (puede tardar 1-2 minutos)

---

## ✅ PASO 6: Verificar que Todo Funciona

### 6.1 Verificar Frontend

1. Abre tu navegador
2. Ve a la URL de Netlify: `https://amazing-site-12345.netlify.app`
3. Deberías ver tu página cargando

### 6.2 Verificar Panel Admin

1. Ve a: `https://amazing-site-12345.netlify.app/#/admin`
2. Deberías ver la pantalla de login
3. Intenta iniciar sesión:
   - Usuario: `admin`
   - Contraseña: `Rifas2024!Admin#Seguro`

### 6.3 Verificar Conexión con Backend

1. Abre las **Developer Tools** (F12)
2. Ve a la pestaña **"Network"**
3. Recarga la página
4. Deberías ver requests a tu backend de Railway (sin errores CORS)

---

## 📝 Resumen de URLs

Después de completar todos los pasos tendrás:

- **Backend API**: `https://tu-backend-production.up.railway.app/api`
- **Health Check**: `https://tu-backend-production.up.railway.app/api/health`
- **Frontend**: `https://amazing-site-12345.netlify.app`
- **Panel Admin**: `https://amazing-site-12345.netlify.app/#/admin`

---

## 🎯 Checklist

- [ ] Backend desplegado en Railway ✅
- [ ] Health check funciona
- [ ] Variables de entorno configuradas
- [ ] Migraciones ejecutadas
- [ ] URL del backend obtenida
- [ ] Frontend desplegado en Netlify
- [ ] Variable `VITE_API_URL` configurada en Netlify
- [ ] CORS actualizado en Railway
- [ ] Página carga correctamente
- [ ] Panel admin accesible

---

## 🆘 Si Algo No Funciona

### Frontend no se conecta al backend
- Verifica que `VITE_API_URL` tenga la URL correcta del backend
- Verifica que el backend esté activo (health check)
- Verifica que CORS esté configurado correctamente

### Error de CORS
- Verifica que `CORS_ORIGINS` tenga la URL exacta de Netlify
- Espera 1-2 minutos después de actualizar CORS (Railway redeploya)
- Verifica que la URL no tenga "/" al final

---

## 🚀 Siguiente Paso Inmediato

**Ahora mismo, haz esto:**

1. **Copia la URL de tu backend de Railway**
2. **Ve a Netlify y despliega el frontend** (Paso 4)
3. **Usa la URL del backend en `VITE_API_URL`**

¿Tienes la URL de tu backend de Railway? Si la tienes, podemos continuar con Netlify.

