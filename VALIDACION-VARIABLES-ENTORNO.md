# ✅ Validación de Variables de Entorno

## 📋 Checklist Completo - Backend (Railway) y Frontend (Netlify)

---

## 🔧 BACKEND - Railway Variables

### ✅ Variables OBLIGATORIAS

#### 1. `NODE_ENV`
- **Valor**: `production`
- **Dónde**: Railway → Tu servicio → Variables
- **Estado**: ⚠️ Verificar

#### 2. `PORT`
- **Valor**: `3000`
- **Dónde**: Railway → Tu servicio → Variables
- **Nota**: Railway puede asignar el puerto automáticamente, pero es bueno especificarlo
- **Estado**: ⚠️ Verificar

#### 3. `DATABASE_URL`
- **Valor**: `postgresql://postgres:xByilLeCmQsaDXhbyzetJcoEMiuVBfUO@shinkansen.proxy.rlwy.net:47107/railway`
- **Dónde**: Railway → Tu servicio → Variables
- **⚠️ IMPORTANTE**: Esta es tu URL de base de datos actual
- **Estado**: ⚠️ Verificar

#### 4. `JWT_SECRET`
- **Valor**: `a7f3b9c2d8e1f4a6b5c9d2e7f1a4b8c3d6e9f2a5b8c1d4e7f0a3b6c9d2e5f8a1b4`
- **Dónde**: Railway → Tu servicio → Variables
- **⚠️ IMPORTANTE**: Debe ser un string largo y aleatorio
- **Estado**: ⚠️ Verificar

#### 5. `CORS_ORIGINS`
- **Valor**: `https://tu-url-netlify.netlify.app`
- **Dónde**: Railway → Tu servicio → Variables
- **⚠️ IMPORTANTE**: 
  - Debe ser la URL exacta de tu frontend en Netlify
  - Sin "/" al final
  - Con "https://"
  - Si tienes múltiples URLs, sepáralas con comas
- **Estado**: ⚠️ Actualizar después de desplegar frontend

---

### 📝 Variables OPCIONALES (No necesarias para funcionar)

#### `CLOUDINARY_CLOUD_NAME` (Opcional)
- Solo si usas Cloudinary para imágenes
- **Estado**: ❌ No necesario

#### `CLOUDINARY_API_KEY` (Opcional)
- Solo si usas Cloudinary
- **Estado**: ❌ No necesario

#### `CLOUDINARY_API_SECRET` (Opcional)
- Solo si usas Cloudinary
- **Estado**: ❌ No necesario

#### `RENDER_DEPLOY_HOOK` (Opcional)
- Solo si usas Render
- **Estado**: ❌ No necesario

---

## 🌐 FRONTEND - Netlify Variables

### ✅ Variables OBLIGATORIAS

#### 1. `VITE_API_URL`
- **Valor**: `https://rifasdelasuerte-production.up.railway.app/api`
- **Dónde**: Netlify → Tu sitio → Site settings → Environment variables
- **⚠️ IMPORTANTE**: 
  - Debe terminar en `/api`
  - Debe ser `https://` (no `http://`)
  - Esta es la URL de tu backend en Railway
- **Estado**: ⚠️ Verificar

---

### 📝 Variables OPCIONALES (No necesarias)

#### `GEMINI_API_KEY` (Opcional)
- Solo si usas funciones de IA con Gemini
- **Estado**: ❌ No necesario para funcionamiento básico

---

## ✅ Checklist de Validación

### Backend (Railway)

- [ ] `NODE_ENV=production`
- [ ] `PORT=3000`
- [ ] `DATABASE_URL` configurada (tu URL de PostgreSQL)
- [ ] `JWT_SECRET` configurada (string largo y seguro)
- [ ] `CORS_ORIGINS` configurada (URL de Netlify después del deploy)

### Frontend (Netlify)

- [ ] `VITE_API_URL` configurada (`https://rifasdelasuerte-production.up.railway.app/api`)

---

## 🔍 Cómo Verificar Variables en Railway

1. Ve a: https://railway.app
2. Entra a tu proyecto
3. Click en tu servicio (backend)
4. Ve a la pestaña **"Variables"**
5. Verifica que todas las variables obligatorias estén ahí

---

## 🔍 Cómo Verificar Variables en Netlify

1. Ve a: https://netlify.com
2. Entra a tu sitio
3. Ve a **"Site settings"** → **"Environment variables"**
4. Verifica que `VITE_API_URL` esté configurada

---

## 📝 Valores Actuales (Para Copiar y Pegar)

### Railway (Backend)

```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://postgres:xByilLeCmQsaDXhbyzetJcoEMiuVBfUO@shinkansen.proxy.rlwy.net:47107/railway
JWT_SECRET=a7f3b9c2d8e1f4a6b5c9d2e7f1a4b8c3d6e9f2a5b8c1d4e7f0a3b6c9d2e5f8a1b4
CORS_ORIGINS=https://tu-url-netlify.netlify.app
```

**⚠️ IMPORTANTE**: Reemplaza `https://tu-url-netlify.netlify.app` con la URL real de Netlify después de desplegar el frontend.

### Netlify (Frontend)

```
VITE_API_URL=https://rifasdelasuerte-production.up.railway.app/api
```

---

## 🆘 Problemas Comunes

### Backend no se conecta a la base de datos
- ✅ Verifica que `DATABASE_URL` sea correcta
- ✅ Verifica que la base de datos esté activa

### Frontend no se conecta al backend
- ✅ Verifica que `VITE_API_URL` sea: `https://rifasdelasuerte-production.up.railway.app/api`
- ✅ Verifica que termine en `/api`
- ✅ Verifica que sea `https://` (no `http://`)

### Error de CORS
- ✅ Verifica que `CORS_ORIGINS` tenga la URL exacta de Netlify
- ✅ Verifica que no tenga "/" al final
- ✅ Verifica que sea `https://`
- ✅ Espera 1-2 minutos después de actualizar (Railway redeploya)

### Error de autenticación
- ✅ Verifica que `JWT_SECRET` esté configurada
- ✅ Verifica que sea un string largo (mínimo 32 caracteres)

---

## ✅ Resumen

### Backend (Railway) - 5 Variables Obligatorias:
1. `NODE_ENV=production`
2. `PORT=3000`
3. `DATABASE_URL` (tu URL de PostgreSQL)
4. `JWT_SECRET` (string seguro)
5. `CORS_ORIGINS` (URL de Netlify)

### Frontend (Netlify) - 1 Variable Obligatoria:
1. `VITE_API_URL=https://rifasdelasuerte-production.up.railway.app/api`

---

**Verifica que todas estas variables estén configuradas correctamente en Railway y Netlify.**

