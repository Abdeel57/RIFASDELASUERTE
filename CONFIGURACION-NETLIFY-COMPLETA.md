# 🌐 Configuración Completa para Netlify

## ✅ Backend URL
**URL del Backend**: `https://rifasdelasuerte-production.up.railway.app`

---

## 🚀 PASO 1: Ir a Netlify

1. Abre tu navegador
2. Ve a: **https://netlify.com**
3. Inicia sesión (puedes usar GitHub)

---

## 📦 PASO 2: Importar Proyecto

1. En el dashboard, click en **"Add new site"**
2. Selecciona **"Import an existing project"**
3. Click en **"Deploy with GitHub"**
4. Si es la primera vez, autoriza Netlify para acceder a GitHub
5. Selecciona tu repositorio: **`Abdeel57/RIFASDELASUERTE`**

---

## ⚙️ PASO 3: Configurar Build Settings

Netlify te mostrará una pantalla de configuración. Configura:

### Base directory:
- Click en **"Show advanced"** o busca **"Base directory"**
- Escribe: **`frontend`**

### Build command:
- Escribe: **`npm run build`**

### Publish directory:
- Escribe: **`frontend/dist`**

---

## 🔐 PASO 4: Configurar Variable de Entorno (MUY IMPORTANTE)

**ANTES de hacer deploy**, agrega esta variable:

1. En la misma pantalla, busca **"Environment variables"** o **"Advanced build settings"**
2. Click en **"New variable"** o **"Add variable"**
3. Agrega:

**Variable:**
- **Key**: `VITE_API_URL`
- **Value**: `https://rifasdelasuerte-production.up.railway.app/api`

4. Click en **"Add variable"** o **"Save"**

**⚠️ IMPORTANTE**: 
- La URL debe terminar en `/api` (no solo el dominio)
- Debe ser `https://` (no `http://`)

---

## 🚀 PASO 5: Deploy

1. Revisa que todo esté correcto:
   - ✅ Base directory: `frontend`
   - ✅ Build command: `npm run build`
   - ✅ Publish directory: `frontend/dist`
   - ✅ Variable `VITE_API_URL` configurada

2. Click en **"Deploy site"**

3. Espera 3-5 minutos mientras Netlify construye tu sitio

---

## 🌐 PASO 6: Obtener URL de Netlify

Una vez que el deploy termine:

1. Netlify te dará una URL como:
   ```
   https://amazing-site-12345.netlify.app
   ```
2. **📋 COPIA ESTA URL** - La necesitarás para actualizar CORS

---

## 🔄 PASO 7: Actualizar CORS en Railway

Una vez que tengas la URL de Netlify:

1. Ve a Railway: https://railway.app
2. Entra a tu proyecto
3. Click en tu servicio (backend)
4. Ve a la pestaña **"Variables"**
5. Busca la variable `CORS_ORIGINS`
6. Si no existe, créala
7. Actualiza el valor con la URL de Netlify:
   ```
   https://amazing-site-12345.netlify.app
   ```
   (Reemplaza con tu URL real de Netlify)
8. Click en **"Save"**

**⚠️ IMPORTANTE**: 
- Sin "/" al final
- Con "https://"
- Railway redeployará automáticamente (puede tardar 1-2 minutos)

---

## ✅ PASO 8: Verificar que Todo Funciona

### 8.1 Verificar Frontend
1. Abre tu navegador
2. Ve a la URL de Netlify
3. Deberías ver tu página cargando

### 8.2 Verificar Panel Admin
1. Ve a: `https://tu-url-netlify.netlify.app/#/admin`
2. Deberías ver la pantalla de login
3. Intenta iniciar sesión:
   - Usuario: `admin`
   - Contraseña: `Rifas2024!Admin#Seguro`

### 8.3 Verificar Conexión con Backend
1. Abre las **Developer Tools** (F12)
2. Ve a la pestaña **"Network"**
3. Recarga la página
4. Deberías ver requests a tu backend (sin errores CORS)

---

## 📝 Resumen de URLs

Después de completar todos los pasos tendrás:

- **Backend API**: `https://rifasdelasuerte-production.up.railway.app/api`
- **Health Check**: `https://rifasdelasuerte-production.up.railway.app/api/health`
- **Frontend**: `https://tu-url-netlify.netlify.app`
- **Panel Admin**: `https://tu-url-netlify.netlify.app/#/admin`

---

## 🆘 Solución de Problemas

### Frontend no se conecta al backend
- ✅ Verifica que `VITE_API_URL` sea: `https://rifasdelasuerte-production.up.railway.app/api`
- ✅ Verifica que el backend esté activo: https://rifasdelasuerte-production.up.railway.app/api/health
- ✅ Verifica que CORS esté configurado con la URL de Netlify

### Error de CORS
- ✅ Verifica que `CORS_ORIGINS` tenga la URL exacta de Netlify
- ✅ Espera 1-2 minutos después de actualizar CORS (Railway redeploya)
- ✅ Verifica que la URL no tenga "/" al final

---

## ✅ Checklist

- [ ] Backend desplegado en Railway ✅
- [ ] URL del backend obtenida ✅
- [ ] Frontend desplegado en Netlify
- [ ] Variable `VITE_API_URL` configurada: `https://rifasdelasuerte-production.up.railway.app/api`
- [ ] URL de Netlify obtenida
- [ ] CORS actualizado en Railway
- [ ] Página carga correctamente
- [ ] Panel admin accesible

---

¡Sigue estos pasos y tu página estará en línea! 🚀

