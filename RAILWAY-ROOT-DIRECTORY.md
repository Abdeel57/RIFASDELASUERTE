# 🔍 Cómo Encontrar Root Directory en Railway

## 📍 Ubicaciones Posibles

Railway ha cambiado su interfaz varias veces. Aquí están todas las ubicaciones posibles:

---

## 🎯 MÉTODO 1: Settings → Service Settings

1. En tu proyecto de Railway, click en tu **servicio** (el que acabas de crear)
2. Ve a la pestaña **"Settings"** (arriba)
3. Busca la sección **"Service Settings"** o **"Configuration"**
4. Busca **"Root Directory"** o **"Working Directory"**
5. Si no lo ves, busca **"Show advanced"** o **"Advanced settings"**

---

## 🎯 MÉTODO 2: Variables Tab

1. En tu servicio, ve a la pestaña **"Variables"**
2. Arriba a la derecha, busca un botón **"Settings"** o **"⚙️"**
3. Click ahí y busca **"Root Directory"**

---

## 🎯 MÉTODO 3: Deploy Settings

1. En tu servicio, ve a **"Deployments"**
2. Click en el último deployment
3. Busca **"Deploy Settings"** o **"Configure"**
4. Ahí debería estar **"Root Directory"**

---

## 🎯 MÉTODO 4: Service Configuration (Nueva Interfaz)

En la nueva interfaz de Railway:

1. Click en tu **servicio**
2. Arriba, busca **"Settings"** o el ícono de **⚙️**
3. En el menú lateral izquierdo, busca:
   - **"Service"**
   - **"Configuration"**
   - **"Build"**
4. Busca **"Root Directory"** o **"Source"**

---

## 🎯 MÉTODO 5: Usar railway.json (Alternativa)

Si no encuentras Root Directory, puedes configurarlo en el archivo `railway.json`:

Tu archivo `railway.json` ya existe y está configurado, pero puedes agregar:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd backend && npm install && npx prisma generate && npx nest build"
  },
  "deploy": {
    "startCommand": "cd backend && npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  },
  "source": {
    "repo": "Abdeel57/RIFASDELASUERTE",
    "branch": "main",
    "rootDirectory": "backend"
  }
}
```

**Nota**: El `buildCommand` ya incluye `cd backend`, así que Railway debería funcionar aunque no encuentres Root Directory.

---

## 🔧 SOLUCIÓN ALTERNATIVA: Configurar en Build Command

Si no encuentras Root Directory, asegúrate de que el **Build Command** incluya `cd backend`:

1. Ve a **Settings** → **"Build & Deploy"** o **"Deploy"**
2. Busca **"Build Command"**
3. Asegúrate de que sea:
   ```
   cd backend && npm install && npx prisma generate && npx nest build
   ```
4. Y el **Start Command**:
   ```
   cd backend && npm run start:prod
   ```

---

## 📸 ¿Qué ves en Settings?

Si puedes, describe qué opciones ves en Settings:
- ¿Ves "Build & Deploy"?
- ¿Ves "Variables"?
- ¿Ves "Networking"?
- ¿Ves algún botón "Advanced" o "Show more"?

---

## ✅ Verificación Rápida

Tu `railway.json` ya tiene los comandos correctos con `cd backend`, así que **debería funcionar** aunque no encuentres Root Directory.

**Prueba esto:**
1. Deja Railway hacer el deploy automático
2. Revisa los logs
3. Si falla, verifica que el Build Command tenga `cd backend`

---

## 🆘 Si Nada Funciona

1. **Deja que Railway haga el deploy automático** (puede que funcione sin Root Directory)
2. Si falla, revisa los **logs** para ver el error
3. Comparte el error y te ayudo a solucionarlo

---

**¿Qué opciones ves en Settings?** Compártelo y te ayudo a encontrarlo específicamente.

