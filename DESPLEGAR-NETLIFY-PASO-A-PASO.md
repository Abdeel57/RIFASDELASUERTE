# 🌐 Desplegar Frontend en Netlify - Paso a Paso

## ✅ PREPARACIÓN

### Necesitas tener:
- [ ] Backend desplegado en Railway (con URL pública)
- [ ] Cuenta en Netlify.com (o créala ahora)
- [ ] Tu código en GitHub

---

## 🚀 PASO 1: Crear Sitio en Netlify

### 1.1 Ir a Netlify
1. Abre tu navegador
2. Ve a: **https://netlify.com**
3. Click en **"Sign up"** o **"Log in"**

### 1.2 Iniciar sesión
- Puedes usar **GitHub** para iniciar sesión (recomendado)
- O crear cuenta con email

### 1.3 Importar proyecto
1. En el dashboard, click en **"Add new site"**
2. Selecciona **"Import an existing project"**
3. Click en **"Deploy with GitHub"**
4. Si es la primera vez, autoriza Netlify para acceder a GitHub
5. Selecciona tu repositorio (el mismo que usaste en Railway)

---

## ⚙️ PASO 2: Configurar Build Settings

### 2.1 Configurar directorios
Netlify te mostrará una pantalla de configuración. Configura:

#### Base directory:
- Click en **"Show advanced"** o busca **"Base directory"**
- Escribe: **`frontend`**

#### Build command:
- Escribe: **`npm run build`**

#### Publish directory:
- Escribe: **`frontend/dist`**

### 2.2 Configurar variables de entorno
Antes de hacer deploy, configura las variables:

1. En la misma pantalla, busca **"Environment variables"** o **"Advanced build settings"**
2. Click en **"New variable"**
3. Agrega:

**Variable: VITE_API_URL**
- **Key**: `VITE_API_URL`
- **Value**: `https://tu-backend-production.up.railway.app/api`
  - ⚠️ **Reemplaza** `tu-backend-production.up.railway.app` con la URL real de tu backend de Railway

4. Click en **"Add variable"**

### 2.3 Deploy
1. Revisa que todo esté correcto
2. Click en **"Deploy site"**

**⏱️ Esto puede tardar 3-5 minutos**

---

## 🌐 PASO 3: Obtener URL de tu Sitio

### 3.1 Esperar el deploy
1. Netlify está construyendo tu sitio
2. Verás el progreso en tiempo real
3. Espera a que diga **"Published"** o **"Live"**

### 3.2 Copiar URL
Netlify te dará una URL como:
```
https://amazing-site-12345.netlify.app
```

**📋 COPIA ESTA URL** - La necesitarás para:
- Actualizar CORS en Railway
- Acceder a tu sitio

---

## 🔄 PASO 4: Actualizar CORS en Railway

### 4.1 Volver a Railway
1. Ve a Railway.app
2. Entra a tu proyecto
3. Click en tu servicio de backend

### 4.2 Actualizar CORS_ORIGINS
1. Ve a **"Variables"**
2. Encuentra la variable `CORS_ORIGINS`
3. Click en el lápiz (editar)
4. Cambia el valor a la URL de Netlify:
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

## ✅ PASO 5: Verificar que Todo Funciona

### 5.1 Verificar Frontend
1. Abre tu navegador
2. Ve a la URL de Netlify: `https://amazing-site-12345.netlify.app`
3. Deberías ver tu página cargando

### 5.2 Verificar Panel Admin
1. Ve a: `https://amazing-site-12345.netlify.app/#/admin`
2. Deberías ver la pantalla de login
3. Intenta iniciar sesión:
   - Usuario: `admin`
   - Contraseña: `Rifas2024!Admin#Seguro`

### 5.3 Verificar Conexión con Backend
1. Abre las **Developer Tools** (F12)
2. Ve a la pestaña **"Network"**
3. Recarga la página
4. Deberías ver requests a tu backend de Railway (sin errores CORS)

---

## 🔧 PASO 6: Configurar Dominio Personalizado (Opcional)

Si tienes un dominio propio:

### 6.1 Agregar dominio
1. En Netlify, ve a tu sitio
2. Click en **"Domain settings"**
3. Click en **"Add custom domain"**
4. Ingresa tu dominio
5. Sigue las instrucciones para configurar DNS

### 6.2 Actualizar CORS
1. Vuelve a Railway
2. Actualiza `CORS_ORIGINS` con tu dominio personalizado:
   ```
   https://tudominio.com,https://www.tudominio.com
   ```
   (Separa múltiples URLs con comas)

---

## 🆘 Solución de Problemas

### Error: "Build failed"
- ✅ Verifica que **Base directory** sea `frontend`
- ✅ Verifica que **Build command** sea `npm run build`
- ✅ Verifica que **Publish directory** sea `frontend/dist`
- ✅ Revisa los logs de build en Netlify

### Error: "Cannot connect to API"
- ✅ Verifica que `VITE_API_URL` esté correcta en Netlify
- ✅ Verifica que el backend esté activo en Railway
- ✅ Verifica que CORS esté configurado correctamente

### Error de CORS en el navegador
- ✅ Verifica que `CORS_ORIGINS` en Railway tenga tu URL de Netlify
- ✅ Verifica que la URL no tenga "/" al final
- ✅ Espera 1-2 minutos después de actualizar CORS (Railway redeploya)

### La página carga pero no hay datos
- ✅ Verifica que `VITE_API_URL` apunte al backend correcto
- ✅ Abre Developer Tools (F12) → Console para ver errores
- ✅ Verifica que el backend responda en `/api/health`

---

## ✅ Checklist Final

- [ ] Sitio creado en Netlify
- [ ] Repositorio conectado
- [ ] Base directory configurado: `frontend`
- [ ] Build command configurado: `npm run build`
- [ ] Publish directory configurado: `frontend/dist`
- [ ] Variable `VITE_API_URL` configurada
- [ ] Deploy completado exitosamente
- [ ] URL de Netlify obtenida
- [ ] CORS actualizado en Railway
- [ ] Página carga correctamente
- [ ] Panel admin accesible
- [ ] Conexión con backend funciona

---

## 📝 URLs Finales

Después del despliegue tendrás:

- **Frontend**: `https://amazing-site-12345.netlify.app`
- **Panel Admin**: `https://amazing-site-12345.netlify.app/#/admin`
- **Backend API**: `https://tu-backend-production.up.railway.app/api`

---

## 🎉 ¡Listo!

Tu página está en línea. Los usuarios pueden:
- ✅ Ver tu sitio web
- ✅ Comprar boletos
- ✅ Ver rifas activas
- ✅ Acceder al panel admin

---

## 🔄 Actualizaciones Futuras

### Cuando hagas cambios:

**Backend:**
- Haz `git push` a GitHub
- Railway desplegará automáticamente

**Frontend:**
- Haz `git push` a GitHub
- Netlify desplegará automáticamente

**No necesitas hacer nada más** - Todo es automático! 🚀

---

## 💡 Tips

1. **Netlify es gratuito** para sitios estáticos
2. **Railway es gratuito** hasta cierto límite (suficiente para empezar)
3. **Los deploys son automáticos** cuando haces push a GitHub
4. **Puedes ver logs en tiempo real** en ambos servicios
5. **Puedes hacer rollback** fácilmente desde los dashboards

---

¡Tu página está lista para el mundo! 🌍

