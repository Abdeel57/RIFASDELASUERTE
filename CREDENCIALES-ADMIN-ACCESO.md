# 🔐 Credenciales de Acceso - Panel Administrador

## 📋 Información de Acceso

### Panel de Administración

**URL del Panel Admin:**
```
https://tu-url-netlify.netlify.app/#/admin
```
(Reemplaza `tu-url-netlify.netlify.app` con tu URL real de Netlify)

---

## 👤 Credenciales

### Usuario Administrador:

**Usuario:** `admin`

**Contraseña:** `Rifas2024!Admin#Seguro`

---

## 🚀 Cómo Acceder

1. **Abre tu navegador**
2. **Ve a tu sitio en Netlify:**
   - URL: `https://tu-url-netlify.netlify.app/#/admin`
   - (Usa la URL que te dio Netlify)
3. **Ingresa las credenciales:**
   - Usuario: `admin`
   - Contraseña: `Rifas2024!Admin#Seguro`
4. **Click en "Iniciar Sesión"**

---

## ⚠️ IMPORTANTE - Seguridad

### Después de Acceder:

1. **Cambia la contraseña inmediatamente:**
   - Ve a "Configuración" o "Perfil"
   - Cambia la contraseña por una más segura
   - Guarda la nueva contraseña en un lugar seguro

2. **No compartas estas credenciales:**
   - Son credenciales de administrador
   - Tienen acceso completo al sistema

---

## 🆘 Si No Puedes Iniciar Sesión

### Problema: "Usuario no encontrado"

**Solución:** El usuario admin no existe en la base de datos.

**Crear usuario admin:**

1. **Obtener DATABASE_URL de Railway:**
   - Railway → Tu servicio → Variables
   - Copia `DATABASE_URL`

2. **Actualizar .env local temporalmente:**
   - Abre `backend/.env`
   - Cambia `DATABASE_URL` a la de Railway
   - Guarda

3. **Crear usuario:**
   ```bash
   cd backend
   node scripts/create-admin-user.js admin "Rifas2024!Admin#Seguro" admin@rifasdelasuerte.com "Administrador Principal"
   ```

4. **Revertir .env:**
   - Vuelve a cambiar `DATABASE_URL` a tu valor local

### Problema: "Contraseña incorrecta"

**Solución:**
- Verifica que estés usando: `Rifas2024!Admin#Seguro`
- Respeta mayúsculas, minúsculas y caracteres especiales
- Si no funciona, crea un nuevo usuario admin (ver arriba)

---

## 📝 Resumen Rápido

```
URL: https://tu-url-netlify.netlify.app/#/admin
Usuario: admin
Contraseña: Rifas2024!Admin#Seguro
```

---

## 🔒 Cambiar Contraseña (Recomendado)

Una vez que accedas:

1. Ve a "Configuración" o "Perfil" en el panel admin
2. Busca "Cambiar Contraseña"
3. Ingresa la contraseña actual
4. Ingresa la nueva contraseña (mínimo 8 caracteres, recomendado: 12+)
5. Confirma la nueva contraseña
6. Guarda

**Ejemplo de contraseña segura:**
- Mínimo 12 caracteres
- Mayúsculas y minúsculas
- Números
- Caracteres especiales (!@#$%^&*)

---

**¡Guarda estas credenciales en un lugar seguro!**

