# 🆘 Solución: No Puedo Iniciar Sesión

## 🔍 Diagnóstico del Problema

Si no puedes iniciar sesión después de actualizar la contraseña, puede haber varios problemas.

---

## ✅ VERIFICACIÓN 1: Backend Funcionando

### Prueba el Health Check:

Abre en tu navegador:
```
https://rifasdelasuerte-production.up.railway.app/api/health
```

**¿Qué ves?**
- ✅ Responde con `{"status": "ok"}` → Backend funciona
- ❌ Error o no responde → Backend no funciona

---

## ✅ VERIFICACIÓN 2: Endpoint de Login

### Prueba el Endpoint de Login Directamente:

Abre las **Developer Tools** (F12) en tu navegador cuando intentas iniciar sesión.

Ve a la pestaña **"Network"** y busca requests a:
- `/api/auth/login` o `/api/admin/auth/login`

**¿Qué ves?**
- ✅ Request exitoso (200) → El backend recibe la petición
- ❌ Error 401 → Credenciales incorrectas
- ❌ Error 500 → Error en el servidor
- ❌ Error CORS → Problema de configuración
- ❌ No hay request → El frontend no está conectando

---

## ✅ VERIFICACIÓN 3: Credenciales Correctas

### Verifica que estés usando:

**Usuario:** `admin` (exactamente así, en minúsculas)

**Contraseña:** `Rifas2024!Admin#Seguro` (exactamente así, respetando mayúsculas, minúsculas y caracteres especiales)

**⚠️ IMPORTANTE:**
- Sin espacios al inicio o final
- Respeta mayúsculas y minúsculas
- Respeta los caracteres especiales: `!`, `#`

---

## ✅ VERIFICACIÓN 4: Frontend Conectado al Backend

### Verifica la Variable de Entorno:

1. Ve a Netlify → Tu sitio → **"Site settings"** → **"Environment variables"**
2. Busca `VITE_API_URL`
3. Debe ser: `https://rifasdelasuerte-production.up.railway.app/api`

**¿Está configurada correctamente?** ✅ / ❌

---

## ✅ VERIFICACIÓN 5: CORS Configurado

### Verifica CORS en Railway:

1. Ve a Railway → Tu servicio → **"Variables"**
2. Busca `CORS_ORIGINS`
3. Debe tener la URL de tu frontend en Netlify

**¿Está configurada?** ✅ / ❌

---

## 🔧 SOLUCIONES

### Solución 1: Verificar Usuario en Base de Datos

El usuario existe, pero vamos a verificar que la contraseña se actualizó correctamente.

**Ejecuta esto:**
```bash
cd backend
# Con DATABASE_URL de Railway configurada
node scripts/update-admin-password.js admin "Rifas2024!Admin#Seguro"
```

### Solución 2: Crear Nuevo Usuario Admin

Si el problema persiste, crea un usuario nuevo con otro nombre:

```bash
cd backend
node scripts/create-admin-user.js admin2 "Password123!" admin2@rifasdelasuerte.com "Admin Secundario"
```

Luego intenta iniciar sesión con:
- Usuario: `admin2`
- Contraseña: `Password123!`

### Solución 3: Verificar Logs del Backend

1. Ve a Railway → Tu servicio → **"Deployments"**
2. Click en el último deployment
3. Revisa los **logs**
4. Busca errores relacionados con:
   - `auth`
   - `login`
   - `bcrypt`
   - `password`

### Solución 4: Probar Login Directamente con API

Puedes probar el login directamente con una herramienta como Postman o curl:

**Endpoint:** `https://rifasdelasuerte-production.up.railway.app/api/admin/auth/login`

**Método:** POST

**Body (JSON):**
```json
{
  "username": "admin",
  "password": "Rifas2024!Admin#Seguro"
}
```

**¿Qué respuesta obtienes?**

---

## 📋 Información que Necesito

Para ayudarte mejor, necesito saber:

1. **¿Qué mensaje de error ves exactamente?**
   - "Usuario o contraseña incorrectos"
   - "Error de conexión"
   - "CORS error"
   - Otro mensaje

2. **¿Qué ves en la consola del navegador?** (F12 → Console)
   - Copia cualquier error que aparezca

3. **¿Qué ves en Network?** (F12 → Network)
   - ¿Se hace el request a `/api/auth/login`?
   - ¿Qué código de respuesta tiene?

4. **¿El backend responde en `/api/health`?**
   - ✅ Sí / ❌ No

---

## 🎯 Prueba Rápida

**Intenta esto:**

1. Abre tu navegador en modo incógnito
2. Ve a tu frontend: `https://tu-url-netlify.netlify.app/#/admin`
3. Intenta iniciar sesión con:
   - Usuario: `admin`
   - Contraseña: `Rifas2024!Admin#Seguro`

**¿Funciona en modo incógnito?** ✅ / ❌

---

**Dime qué mensaje de error exacto ves y te ayudo a solucionarlo específicamente.**

