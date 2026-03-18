# 🔒 Verificar que los Proyectos Están Separados

## ⚠️ Tu Preocupación es Válida

Es importante verificar que tu nuevo proyecto esté completamente separado del anterior para evitar modificaciones accidentales.

---

## ✅ VERIFICACIÓN 1: Base de Datos Separada

### ¿Están usando la misma base de datos?

**CRÍTICO**: Si ambas páginas usan la misma `DATABASE_URL`, compartirán datos.

### Cómo Verificar:

#### En Railway (Tu Nuevo Backend):
1. Ve a Railway → Tu servicio (backend)
2. Ve a **"Variables"**
3. Busca `DATABASE_URL`
4. **COPIA esta URL completa**

#### Compara con la Página Anterior:
- Si la `DATABASE_URL` es **DIFERENTE** → ✅ Están separadas
- Si la `DATABASE_URL` es **LA MISMA** → ⚠️ Están compartiendo datos

### Si Comparten la Misma Base de Datos:

**OPCIÓN A: Crear Nueva Base de Datos (Recomendado)**
1. En Railway, ve a tu proyecto
2. Click en **"+ New"** → **"Database"** → **"Add PostgreSQL"**
3. Railway creará una nueva base de datos
4. Railway automáticamente creará una nueva `DATABASE_URL`
5. Actualiza la variable `DATABASE_URL` en tu servicio backend
6. Ejecuta migraciones: `cd backend && npx prisma migrate deploy`

**OPCIÓN B: Usar Base de Datos Existente (Si quieres compartir datos)**
- Si quieres que compartan datos, está bien
- Pero asegúrate de que es lo que quieres

---

## ✅ VERIFICACIÓN 2: URLs de Backend Separadas

### Verifica que los Backends sean Diferentes:

**Tu Nuevo Backend:**
- URL: `https://rifasdelasuerte-production.up.railway.app`

**Backend Anterior:**
- ¿Cuál es la URL del backend anterior?
- Si son diferentes → ✅ Están separados
- Si son iguales → ⚠️ Están usando el mismo backend

---

## ✅ VERIFICACIÓN 3: URLs de Frontend Separadas

### Verifica que los Frontends sean Diferentes:

**Tu Nuevo Frontend (Netlify):**
- ¿Cuál es la URL de Netlify que te dio?

**Frontend Anterior:**
- ¿Cuál es la URL del frontend anterior?
- Si son diferentes → ✅ Están separados
- Si son iguales → ⚠️ Están usando el mismo frontend

---

## ✅ VERIFICACIÓN 4: Variables de Entorno Separadas

### En Railway (Backend):

Verifica que `CORS_ORIGINS` apunte SOLO a tu nuevo frontend:

1. Ve a Railway → Tu servicio → **"Variables"**
2. Busca `CORS_ORIGINS`
3. Debe tener SOLO la URL de tu nuevo frontend en Netlify
4. **NO debe tener** la URL del frontend anterior

**Ejemplo Correcto:**
```
CORS_ORIGINS=https://tu-nuevo-sitio.netlify.app
```

**Ejemplo Incorrecto (si quieres separarlos):**
```
CORS_ORIGINS=https://sitio-anterior.netlify.app,https://tu-nuevo-sitio.netlify.app
```

### En Netlify (Frontend):

Verifica que `VITE_API_URL` apunte SOLO a tu nuevo backend:

1. Ve a Netlify → Tu sitio → **"Environment variables"**
2. Busca `VITE_API_URL`
3. Debe ser: `https://rifasdelasuerte-production.up.railway.app/api`
4. **NO debe ser** la URL del backend anterior

---

## 🔒 CÓMO ASEGURARSE DE QUE ESTÁN SEPARADOS

### Paso 1: Verificar Base de Datos

```bash
# En Railway, verifica la DATABASE_URL
# Debe ser diferente a la del proyecto anterior
```

### Paso 2: Hacer un Cambio de Prueba

**En tu Nuevo Proyecto:**
1. Accede al panel admin: `https://tu-nuevo-netlify.netlify.app/#/admin`
2. Inicia sesión
3. Cambia algo pequeño (ej: nombre del sitio a "PRUEBA SEPARACION")
4. Guarda

**En el Proyecto Anterior:**
1. Accede al panel admin del proyecto anterior
2. Verifica que **NO** cambió el nombre del sitio
3. Si NO cambió → ✅ Están separados
4. Si cambió → ⚠️ Están compartiendo datos

---

## 🆘 SI ESTÁN COMPARTIENDO DATOS (Y NO QUIERES)

### Solución: Crear Nueva Base de Datos

1. **En Railway:**
   - Ve a tu proyecto
   - Click en **"+ New"** → **"Database"** → **"Add PostgreSQL"**
   - Railway creará una nueva base de datos
   - Railway automáticamente creará `DATABASE_URL_NEW`

2. **Actualizar Variables:**
   - Ve a tu servicio backend → **"Variables"**
   - Actualiza `DATABASE_URL` con la nueva URL
   - Guarda

3. **Ejecutar Migraciones:**
   - En Railway → Tu servicio → **"Deployments"**
   - Click en el último deployment
   - Busca **"Run Command"**
   - Ejecuta: `cd backend && npx prisma migrate deploy`

4. **Crear Usuario Admin Nuevo:**
   - Desde tu máquina local, conecta a la nueva base de datos
   - Ejecuta: `node backend/scripts/create-admin-user.js admin "NuevaPassword123" admin@nuevo.com "Admin Nuevo"`

---

## ✅ CHECKLIST DE SEPARACIÓN

Verifica cada punto:

- [ ] `DATABASE_URL` en Railway es diferente a la del proyecto anterior
- [ ] URL del backend es diferente (`rifasdelasuerte-production.up.railway.app`)
- [ ] URL del frontend es diferente (tu nueva URL de Netlify)
- [ ] `CORS_ORIGINS` solo tiene la URL del nuevo frontend
- [ ] `VITE_API_URL` solo tiene la URL del nuevo backend
- [ ] Cambios en el nuevo proyecto NO afectan el anterior
- [ ] Cambios en el anterior NO afectan el nuevo proyecto

---

## 📝 Resumen de URLs para Verificar

### Tu Nuevo Proyecto:
- **Backend**: `https://rifasdelasuerte-production.up.railway.app`
- **Frontend**: `https://tu-nueva-url.netlify.app` (la que te dio Netlify)
- **Base de Datos**: Verifica en Railway → Variables → `DATABASE_URL`

### Proyecto Anterior:
- **Backend**: ¿Cuál es?
- **Frontend**: ¿Cuál es?
- **Base de Datos**: ¿Cuál es?

**Compara y verifica que sean diferentes.**

---

## 🎯 Acción Inmediata

**Haz esto AHORA:**

1. **Verifica `DATABASE_URL` en Railway**
   - ¿Es diferente a la del proyecto anterior?
   - Si es la misma → Crea nueva base de datos

2. **Haz un cambio de prueba**
   - Cambia algo en el nuevo proyecto
   - Verifica que NO cambie en el anterior

3. **Verifica URLs**
   - Backend nuevo ≠ Backend anterior
   - Frontend nuevo ≠ Frontend anterior

---

**¿Quieres que te ayude a verificar cada punto específicamente?** Comparte las URLs del proyecto anterior y te ayudo a compararlas.

