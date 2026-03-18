# 🚀 Ejecutar Migraciones AHORA - Guía Paso a Paso

## 📋 Información que Necesito de Ti

Para ayudarte a ejecutar las migraciones, necesito que me digas:

1. **¿Puedes acceder a Railway?**
   - Ve a: https://railway.app
   - ¿Puedes ver tu proyecto y servicio?

2. **¿Qué opciones ves en Railway?**
   - Cuando entras a tu servicio (backend)
   - ¿Ves pestañas como "Deployments", "Variables", "Settings"?
   - ¿Ves algún botón de "Terminal", "Shell", o "Run Command"?

---

## 🎯 PASO A PASO - Método 1: Desde Railway

### Paso 1: Acceder a Railway

1. Abre tu navegador
2. Ve a: **https://railway.app**
3. Inicia sesión
4. Entra a tu proyecto
5. Click en tu servicio (backend)

**¿Puedes ver tu servicio?** ✅ / ❌

### Paso 2: Buscar Opción de Terminal/Comando

1. En tu servicio, busca una de estas opciones:
   - **"Deployments"** (pestaña)
   - **"Terminal"** (botón o pestaña)
   - **"Shell"** (botón)
   - **"Run Command"** (botón)
   - **"One-off Command"** (botón)
   - O un ícono de **"⚙️"** o **"Terminal"**

**¿Qué opciones ves?** Dime cuáles aparecen.

### Paso 3: Ejecutar Comando

Una vez que encuentres la opción de terminal/comando:

1. Click en ella
2. Escribe este comando:
   ```bash
   cd backend && npx prisma migrate deploy
   ```
3. Presiona Enter
4. Espera a que termine (puede tardar 30-60 segundos)

**¿Qué mensajes ves?** Copia y pégame lo que aparece.

---

## 🎯 PASO A PASO - Método 2: Desde tu Máquina Local

Si Railway no tiene terminal, podemos hacerlo desde tu computadora:

### Paso 1: Obtener DATABASE_URL de Railway

1. En Railway → Tu servicio → **"Variables"**
2. Busca `DATABASE_URL`
3. **Copia el valor completo** (empieza con `postgresql://...`)

**¿Puedes copiarme la DATABASE_URL?** (Solo la URL, no la compartiré)

### Paso 2: Actualizar .env Local

1. Abre `backend/.env` en tu editor
2. Busca la línea `DATABASE_URL=`
3. Temporalmente, cambia el valor a la URL de Railway
4. Guarda el archivo

**¿Puedes hacer esto?** ✅ / ❌

### Paso 3: Ejecutar Migraciones

Desde tu terminal, ejecuta:

```bash
cd backend
npx prisma migrate deploy
```

**¿Qué resultado ves?** Copia y pégame la salida.

---

## ✅ VERIFICACIÓN DESPUÉS DE EJECUTAR

Después de ejecutar las migraciones, verifica:

1. **Backend responde:**
   - Abre: `https://rifasdelasuerte-production.up.railway.app/api/health`
   - ¿Responde correctamente? ✅ / ❌

2. **Panel admin funciona:**
   - Ve a tu frontend en Netlify
   - Intenta iniciar sesión
   - ¿Funciona? ✅ / ❌

---

## 🆘 Si Hay Problemas

Si ves algún error, cópialo completo y pégamelo aquí. Te ayudo a solucionarlo.

---

## 📝 Resumen de lo que Necesito

1. **¿Puedes acceder a Railway?** ✅ / ❌
2. **¿Qué opciones ves en tu servicio?** (Deployments, Terminal, etc.)
3. **¿Prefieres Método 1 (Railway) o Método 2 (Local)?**
4. **Si hay errores, cópialos aquí**

---

**Empieza por el Paso 1 y dime qué ves. Te guío paso a paso desde ahí.**

