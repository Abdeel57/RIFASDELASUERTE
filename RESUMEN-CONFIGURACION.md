# ✅ Configuración Completada - RIFAS DE LA SUERTE

## 📋 Resumen de la Configuración

**Cliente:** RIFAS DE LA SUERTE  
**Base de Datos:** Configurada (Railway PostgreSQL)  
**Dominio:** No configurado (se puede agregar después)  
**Fecha:** 2024-01-20

---

## 🔐 Credenciales de Administrador

**⚠️ IMPORTANTE: Guarda estas credenciales en un lugar seguro**

```
URL del Panel: http://localhost:5173/#/admin

Usuario: admin
Contraseña: Rifas2024!Admin#Seguro
Email: admin@rifasdelasuerte.com
Nombre: Administrador Principal
```

**📄 Archivo con credenciales:** `CREDENCIALES-ADMIN.txt`

---

## 📝 Próximos Pasos

### 1. Aplicar la Configuración
Ejecuta el script para crear el archivo `.env`:
```bash
node scripts/apply-client-config.js
```

O manualmente, crea `backend/.env` con este contenido:
```env
DATABASE_URL="postgresql://postgres:xByilLeCmQsaDXhbyzetJcoEMiuVBfUO@shinkansen.proxy.rlwy.net:47107/railway"
PORT=3000
NODE_ENV=development
JWT_SECRET="a7f3b9c2d8e1f4a6b5c9d2e7f1a4b8c3d6e9f2a5b8c1d4e7f0a3b6c9d2e5f8a1b4"
CLIENT_DOMAIN=""
```

### 2. Ejecutar Migraciones de Base de Datos
```bash
cd backend
npm run migrate:deploy
```

### 3. Crear Usuario Administrador
Ejecuta el script:
```bash
CREAR-ADMIN-CLIENTE.bat
```

O manualmente:
```bash
node backend\scripts\create-admin-user.js admin Rifas2024!Admin#Seguro admin@rifasdelasuerte.com "Administrador Principal"
```

### 4. Iniciar la Aplicación
```bash
npm start
```

### 5. Acceder al Panel de Administración
Abre tu navegador en:
- **Frontend:** http://localhost:5173
- **Panel Admin:** http://localhost:5173/#/admin
- **Backend API:** http://localhost:3000/api/health

---

## 📁 Archivos Creados/Modificados

✅ `config-cliente.json` - Configuración del cliente  
✅ `CREAR-ADMIN-CLIENTE.bat` - Script para crear usuario admin  
✅ `CREDENCIALES-ADMIN.txt` - Credenciales guardadas  
✅ `backend/.env` - (Se creará al ejecutar apply-client-config.js)

---

## 🔧 Configuración Adicional (Opcional)

### Agregar Dominio (Cuando lo tengas)
1. Edita `config-cliente.json` y agrega el dominio
2. Ejecuta: `node scripts/apply-client-config.js`
3. O edita manualmente `backend/src/main.ts` y agrega los dominios en la sección CORS

### Personalizar la Página
Una vez que inicies sesión en el panel admin, puedes configurar:
- Nombre del sitio
- Logo y favicon
- Colores de la marca
- Información de contacto
- Redes sociales
- Cuentas de pago
- Preguntas frecuentes
- Crear rifas

---

## 🆘 Solución de Problemas

### Error: "No se puede conectar a la base de datos"
- Verifica que la URL de la base de datos sea correcta
- Verifica que la base de datos esté accesible desde tu IP

### Error: "CORS bloqueado"
- Si tienes un dominio, agrégalo en `backend/src/main.ts`

### Error: "Usuario no encontrado"
- Asegúrate de haber ejecutado las migraciones primero
- Luego crea el usuario con `CREAR-ADMIN-CLIENTE.bat`

---

## ✅ Checklist Final

- [ ] Ejecutar `node scripts/apply-client-config.js`
- [ ] Ejecutar migraciones: `cd backend && npm run migrate:deploy`
- [ ] Crear usuario admin: `CREAR-ADMIN-CLIENTE.bat`
- [ ] Iniciar aplicación: `npm start`
- [ ] Acceder al panel y cambiar la contraseña
- [ ] Configurar información básica del sitio

---

**🎉 ¡Todo listo para RIFAS DE LA SUERTE!**

