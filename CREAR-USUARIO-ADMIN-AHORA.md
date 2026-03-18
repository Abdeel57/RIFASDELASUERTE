# 👤 Crear Usuario Admin - Paso a Paso

## 🔍 Problema

No puedes iniciar sesión porque el usuario admin no existe en la base de datos.

---

## 🚀 SOLUCIÓN: Crear Usuario Admin

### Paso 1: Obtener DATABASE_URL de Railway

1. Ve a Railway: https://railway.app
2. Entra a tu proyecto
3. Click en tu servicio (backend)
4. Ve a la pestaña **"Variables"**
5. Busca `DATABASE_URL`
6. **Copia el valor completo** (empieza con `postgresql://...`)

**⚠️ IMPORTANTE:** Necesito esta URL para crear el usuario.

---

### Paso 2: Crear Usuario Admin

Una vez que tengas la `DATABASE_URL`, te ayudo a crear el usuario.

**Opciones:**

**Opción A: Desde tu Máquina Local (Recomendado)**
- Te guío paso a paso
- Es más rápido y seguro

**Opción B: Desde Railway (Si tiene terminal)**
- Si Railway tiene opción de terminal/comando
- Ejecutamos el script desde ahí

---

## 📋 Información del Usuario que Crearemos

- **Usuario:** `admin`
- **Contraseña:** `Rifas2024!Admin#Seguro`
- **Email:** `admin@rifasdelasuerte.com`
- **Nombre:** `Administrador Principal`

---

## 🆘 Si No Funciona

Si después de crear el usuario aún no puedes iniciar sesión:

1. Verifica que la contraseña sea exactamente: `Rifas2024!Admin#Seguro`
2. Respeta mayúsculas, minúsculas y caracteres especiales
3. Verifica que el backend esté funcionando
4. Verifica que no haya errores de CORS

---

**Pégame la DATABASE_URL de Railway y creo el usuario admin ahora mismo.**

