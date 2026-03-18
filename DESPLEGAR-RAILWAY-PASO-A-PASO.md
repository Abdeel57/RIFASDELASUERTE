# 🚂 Desplegar Backend en Railway - Paso a Paso

## ✅ PREPARACIÓN (Antes de empezar)

### 1. Verificar que tienes:
- [ ] Cuenta en GitHub (con tu código subido)
- [ ] Cuenta en Railway.app (o créala ahora)
- [ ] Tu base de datos ya está en Railway (según tu .env)

---

## 🚀 PASO 1: Crear Proyecto en Railway

### 1.1 Ir a Railway
1. Abre tu navegador
2. Ve a: **https://railway.app**
3. Click en **"Start a New Project"** o **"Login"** si ya tienes cuenta

### 1.2 Iniciar sesión
- Puedes usar **GitHub** para iniciar sesión (recomendado)
- O crear cuenta con email

### 1.3 Crear nuevo proyecto
1. Click en **"New Project"** (botón grande)
2. Selecciona **"Deploy from GitHub repo"**
3. Si es la primera vez, autoriza Railway para acceder a GitHub
4. Selecciona tu repositorio (el que tiene este código)
5. Click en **"Deploy Now"**

**⏱️ Esto puede tardar 2-3 minutos**

---

## ⚙️ PASO 2: Configurar el Servicio

### 2.1 Verificar Build Command (IMPORTANTE)

**✅ BUENA NOTICIA**: Tu archivo `railway.json` ya está configurado correctamente con `cd backend`, así que Railway debería funcionar automáticamente.

**Pero verifica que los comandos estén correctos:**

1. En tu servicio de Railway, ve a **"Settings"**
2. Busca **"Build & Deploy"** o **"Deploy"** o **"Configuration"**
3. Verifica que el **Build Command** sea:
   ```
   cd backend && npm install && npx prisma generate && npx nest build
   ```
   (Railway debería leerlo automáticamente del `railway.json`)

4. Verifica que el **Start Command** sea:
   ```
   cd backend && npm run start:prod
   ```

**Si no ves estos comandos o están vacíos:**
- Railway debería usar automáticamente el `railway.json` que ya tienes
- Si no, cópialos manualmente en los campos

### 2.2 Root Directory (OPCIONAL - No es necesario)

**⚠️ NOTA**: Si no encuentras "Root Directory" en Settings, **NO TE PREOCUPES**.

Tu `railway.json` ya tiene `cd backend` en los comandos, así que funcionará sin Root Directory.

**Si lo encuentras** (puede estar en diferentes lugares):
- Busca en **Settings** → **"Service Settings"** o **"Configuration"**
- O en **Settings** → **"Build & Deploy"** → **"Advanced"**
- Cambia de `/` a: **`backend`**
- Click en **"Save"**

**Pero si no lo encuentras, está bien** - los comandos con `cd backend` son suficientes.

---

## 🔐 PASO 3: Configurar Variables de Entorno

### 3.1 Ir a Variables
1. En tu servicio, ve a la pestaña **"Variables"**
2. O en **Settings** → **"Variables"**

### 3.2 Agregar Variables
Click en **"New Variable"** y agrega estas variables UNA POR UNA:

#### Variable 1: NODE_ENV
- **Key**: `NODE_ENV`
- **Value**: `production`
- Click **"Add"**

#### Variable 2: PORT
- **Key**: `PORT`
- **Value**: `3000`
- Click **"Add"**

#### Variable 3: DATABASE_URL
- **Key**: `DATABASE_URL`
- **Value**: `postgresql://postgres:xByilLeCmQsaDXhbyzetJcoEMiuVBfUO@shinkansen.proxy.rlwy.net:47107/railway`
- Click **"Add"**

**Nota**: Esta es la URL de tu base de datos actual. Si Railway crea una nueva BD, usa esa URL.

#### Variable 4: JWT_SECRET
- **Key**: `JWT_SECRET`
- **Value**: `a7f3b9c2d8e1f4a6b5c9d2e7f1a4b8c3d6e9f2a5b8c1d4e7f0a3b6c9d2e5f8a1b4`
- Click **"Add"**

#### Variable 5: CORS_ORIGINS (Temporal)
- **Key**: `CORS_ORIGINS`
- **Value**: `https://tu-sitio.netlify.app` (por ahora, lo actualizarás después)
- Click **"Add"**

**⚠️ IMPORTANTE**: Actualizarás `CORS_ORIGINS` después de desplegar el frontend.

---

## 🌐 PASO 4: Generar Dominio Público

### 4.1 Configurar Networking
1. En tu servicio, ve a **Settings** → **"Networking"**
2. O busca la sección **"Public Domain"**
3. Click en **"Generate Domain"** o **"Custom Domain"**

### 4.2 Copiar URL
Railway te dará una URL como:
```
https://tu-backend-production.up.railway.app
```

**📋 COPIA ESTA URL** - La necesitarás para:
- Configurar el frontend
- Probar que funciona

---

## 🔄 PASO 5: Ejecutar Migraciones

### 5.1 Esperar el primer deploy
1. Railway está construyendo tu backend
2. Espera a que termine (verás "Deployed" en verde)
3. Esto puede tardar 3-5 minutos

### 5.2 Ejecutar migraciones
Una vez que el deploy termine:

**Opción A: Desde Railway (Recomendado)**
1. En tu servicio, ve a **"Deployments"**
2. Click en el último deployment
3. Busca **"Run Command"** o **"One-off Command"**
4. Ejecuta:
   ```bash
   cd backend && npx prisma migrate deploy
   ```
5. Espera a que termine

**Opción B: Desde tu máquina local**
1. Temporalmente, cambia tu `DATABASE_URL` local a la de Railway
2. Ejecuta:
   ```bash
   cd backend
   npx prisma migrate deploy
   ```

---

## ✅ PASO 6: Verificar que Funciona

### 6.1 Health Check
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

### 6.2 Verificar Logs
1. En Railway, ve a tu servicio
2. Click en **"Deployments"** → Último deployment
3. Revisa los **logs** para ver si hay errores
4. Deberías ver: `🚀 Lucky Snap Backend starting...`

---

## 🎯 PASO 7: Actualizar CORS (Después del Frontend)

Una vez que despliegues el frontend en Netlify:

1. Vuelve a Railway → Tu servicio → **Variables**
2. Encuentra `CORS_ORIGINS`
3. Actualiza el valor con la URL real de Netlify:
   ```
   https://tu-sitio-real.netlify.app
   ```
4. Railway redeployará automáticamente

**Nota**: El backend ya permite dominios `.netlify.app` automáticamente, pero es mejor especificar el tuyo.

---

## 🆘 Solución de Problemas

### Error: "Cannot find module"
- ✅ Verifica que **Root Directory** sea `backend`
- ✅ Verifica que el build command incluya `cd backend`

### Error: "Prisma Client not generated"
- ✅ Verifica que el build command incluya `npx prisma generate`
- ✅ Verifica que `DATABASE_URL` esté configurada

### Error: "Database connection failed"
- ✅ Verifica que `DATABASE_URL` sea correcta
- ✅ Verifica que la base de datos esté activa en Railway

### El backend no responde
- ✅ Revisa los logs en Railway
- ✅ Verifica que el servicio esté "Active"
- ✅ Verifica que el dominio público esté configurado

---

## ✅ Checklist Final

- [ ] Proyecto creado en Railway
- [ ] Repositorio conectado
- [ ] Root Directory configurado como `backend`
- [ ] Variables de entorno configuradas (5 variables)
- [ ] Dominio público generado
- [ ] Migraciones ejecutadas
- [ ] Health check funciona
- [ ] Logs sin errores críticos

---

## 📝 URLs Importantes

Después del despliegue tendrás:

- **Backend API**: `https://tu-backend-production.up.railway.app`
- **Health Check**: `https://tu-backend-production.up.railway.app/api/health`
- **API Base**: `https://tu-backend-production.up.railway.app/api`

---

## 🎉 ¡Listo!

Tu backend está desplegado. Ahora puedes:
1. ✅ Probar el health check
2. ✅ Desplegar el frontend en Netlify
3. ✅ Conectar el frontend con este backend

---

**Siguiente paso**: Desplegar el frontend en Netlify (ver `DESPLEGAR-NETLIFY-PASO-A-PASO.md`)

