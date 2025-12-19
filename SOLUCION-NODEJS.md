# 🔧 Solución: Node.js no encontrado

## ✅ El archivo .env ya está creado

El script `CONFIGURAR-TODO.bat` ya creó el archivo `backend/.env` correctamente.

## 🔍 Verificar si Node.js está instalado

Abre una **nueva terminal** (CMD o PowerShell) y ejecuta:

```bash
node --version
npm --version
```

### Si funciona:
- ✅ Node.js está instalado
- Reinicia la terminal y vuelve a ejecutar `CONFIGURAR-TODO.bat`

### Si NO funciona:
- ❌ Node.js no está en el PATH o no está instalado

## 🛠️ Soluciones

### Opción 1: Agregar Node.js al PATH (si está instalado)

1. Busca dónde está instalado Node.js:
   - Busca en: `C:\Program Files\nodejs\`
   - O en: `C:\Users\[TuUsuario]\AppData\Roaming\npm\`

2. Agrega la carpeta al PATH:
   - Presiona `Win + R`, escribe `sysdm.cpl` y presiona Enter
   - Ve a la pestaña "Opciones avanzadas"
   - Click en "Variables de entorno"
   - En "Variables del sistema", busca "Path" y haz click en "Editar"
   - Click en "Nuevo" y agrega la ruta donde está Node.js (ej: `C:\Program Files\nodejs`)
   - Click en "Aceptar" en todas las ventanas
   - **Reinicia la terminal** y prueba de nuevo

### Opción 2: Instalar Node.js

1. Descarga Node.js desde: https://nodejs.org/
2. Instala la versión LTS (recomendada)
3. Durante la instalación, asegúrate de marcar "Add to PATH"
4. Reinicia la terminal después de instalar

### Opción 3: Continuar manualmente

Si Node.js está instalado pero no funciona desde el script, puedes continuar manualmente:

1. Abre una terminal nueva
2. Navega a la carpeta del proyecto:
   ```bash
   cd "C:\Users\Admin\Desktop\Rifas\SORTEOS DE LA SUERTE PAGINA"
   ```

3. Ejecuta estos comandos en orden:

   ```bash
   # Instalar dependencias del backend
   cd backend
   npm install
   
   # Generar cliente Prisma
   npx prisma generate
   
   # Ejecutar migraciones
   npm run migrate:deploy
   
   # Crear usuario administrador
   node scripts\create-admin-user.js admin "Rifas2024!Admin#Seguro" admin@rifasdelasuerte.com "Administrador Principal"
   
   # Volver a la raíz
   cd ..
   
   # Instalar dependencias del frontend
   cd frontend
   npm install
   cd ..
   
   # Iniciar la aplicación
   npm start
   ```

## ✅ Después de configurar

Una vez que todo esté configurado:

1. Accede al panel admin en: http://localhost:5173/#/admin
2. Usuario: `admin`
3. Contraseña: `Rifas2024!Admin#Seguro`
4. Configura tu sitio desde el panel

## 🆘 Si sigue sin funcionar

1. Reinicia tu computadora
2. Abre una terminal nueva
3. Verifica: `node --version`
4. Si funciona, ejecuta `CONFIGURAR-TODO.bat` de nuevo

