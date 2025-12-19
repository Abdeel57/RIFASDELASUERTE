# 🚀 Guía Rápida - Configurar Nuevo Cliente

## 📋 Información Necesaria

Para configurar la página del nuevo cliente, necesito estos datos:

### 1. Información Básica
- **Nombre del cliente/empresa**: ________________
- **Dominio** (opcional, ej: cliente.com): ________________

### 2. Base de Datos PostgreSQL
- **URL de la base de datos**: ________________
  - Si no tienes una, puedes crear una gratis en:
    - [Railway.app](https://railway.app) - Gratis para empezar
    - [Supabase.com](https://supabase.com) - Gratis
    - [Neon.tech](https://neon.tech) - Gratis

### 3. Credenciales de Administrador
- **Usuario admin** (ej: admin): ________________
- **Contraseña admin**: ________________
- **Email del admin**: ________________
- **Nombre del admin**: ________________

---

## ⚡ Opción 1: Configuración Automática (Recomendado)

### Método A: Script Interactivo
1. Ejecuta: `CONFIGURAR-NUEVO-CLIENTE.bat`
2. Responde las preguntas que aparezcan
3. El script configurará todo automáticamente

### Método B: Archivo de Configuración
1. Edita el archivo `config-cliente.json` con los datos del cliente
2. Ejecuta: `node scripts/apply-client-config.js`

---

## ⚡ Opción 2: Configuración Manual

### Paso 1: Configurar Base de Datos
1. Crea una base de datos PostgreSQL (Railway, Supabase, etc.)
2. Copia `backend/env.example` a `backend/.env`
3. Edita `backend/.env` y configura:
   ```
   DATABASE_URL="postgresql://usuario:password@host:puerto/database"
   JWT_SECRET="genera_un_secret_unico"
   ```

### Paso 2: Configurar Dominios (si tienes)
Edita `backend/src/main.ts` y agrega los dominios del cliente en la sección de CORS.

### Paso 3: Inicializar Base de Datos
```bash
cd backend
npm run migrate:deploy
```

### Paso 4: Crear Usuario Administrador
```bash
node backend/scripts/create-admin-user.js usuario password email "Nombre"
```

### Paso 5: Iniciar la Aplicación
```bash
npm start
```

---

## ✅ Verificación

Una vez configurado, verifica que todo funcione:

1. **Frontend**: http://localhost:5173
2. **Backend**: http://localhost:3000/api/health
3. **Panel Admin**: http://localhost:5173/#/admin

---

## 🆘 Ayuda

Si tienes problemas:
- Verifica que Node.js esté instalado
- Verifica que la base de datos esté accesible
- Revisa los logs en la consola
- Consulta `PASOS-IMEDIATOS.md` para más detalles

---

**¿Necesitas ayuda?** Proporcióname la información del cliente y yo configuro todo por ti. 🚀

