# 🔄 Ejecutar Migraciones de Prisma en Railway

## 📋 ¿Qué son las Migraciones?

Las migraciones de Prisma crean la estructura de tu base de datos:
- ✅ Tablas (users, raffles, orders, winners, etc.)
- ✅ Índices (para búsquedas rápidas)
- ✅ Relaciones entre tablas
- ✅ Constraints (validaciones)

**Sin migraciones, tu base de datos está vacía y el backend no funcionará.**

---

## ✅ VERIFICAR SI YA SE EJECUTARON

### Opción A: Desde Railway (Recomendado)

1. Ve a Railway → Tu servicio (backend)
2. Ve a **"Deployments"**
3. Click en el último deployment
4. Revisa los **logs**
5. Busca mensajes como:
   - ✅ `Applying migration...`
   - ✅ `Migration applied successfully`
   - ✅ `All migrations have been applied`

**Si ves estos mensajes → ✅ Las migraciones ya se ejecutaron**

### Opción B: Probar el Backend

1. Abre en tu navegador: `https://rifasdelasuerte-production.up.railway.app/api/health`
2. Si responde correctamente → Probablemente las migraciones están ejecutadas
3. Pero esto no garantiza que todas las tablas existan

---

## 🚀 CÓMO EJECUTAR MIGRACIONES EN RAILWAY

### Método 1: Desde Railway Dashboard (Más Fácil)

1. **Ve a Railway:**
   - Entra a tu proyecto
   - Click en tu servicio (backend)

2. **Ve a Deployments:**
   - Click en **"Deployments"**
   - Click en el último deployment

3. **Ejecutar Comando:**
   - Busca **"Run Command"** o **"One-off Command"** o **"Shell"**
   - O busca un botón **"⚙️"** o **"Terminal"**
   - Escribe:
     ```bash
     cd backend && npx prisma migrate deploy
     ```
   - Presiona Enter

4. **Esperar:**
   - Verás el progreso en tiempo real
   - Deberías ver mensajes como:
     ```
     Applying migration `20250924231524_init`
     Applying migration `20250117000000_add_text_color_fields`
     ...
     All migrations have been applied
     ```

### Método 2: Desde tu Máquina Local

Si Railway no tiene opción de ejecutar comandos:

1. **Conectar a la Base de Datos de Railway:**
   - Ve a Railway → Tu servicio → **"Variables"**
   - Copia la `DATABASE_URL`

2. **Temporalmente actualizar tu .env local:**
   - Abre `backend/.env`
   - Cambia `DATABASE_URL` a la de Railway:
     ```
     DATABASE_URL=postgresql://postgres:...@shinkansen.proxy.rlwy.net:47107/railway
     ```

3. **Ejecutar migraciones:**
   ```bash
   cd backend
   npx prisma migrate deploy
   ```

4. **Verificar:**
   - Deberías ver: `All migrations have been applied`
   - O: `No pending migrations to apply`

5. **Revertir .env:**
   - Vuelve a cambiar `DATABASE_URL` a tu valor local (si quieres)

---

## 📊 VERIFICAR QUE LAS MIGRACIONES FUNCIONARON

### Verificar Tablas Creadas

Puedes verificar desde Railway:

1. Ve a Railway → Tu proyecto
2. Busca tu base de datos PostgreSQL
3. Click en ella
4. Busca **"Query"** o **"SQL Editor"** o **"Data"**
5. Ejecuta:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

**Deberías ver tablas como:**
- `users`
- `raffles`
- `orders`
- `winners`
- `admin_users`
- `settings`
- `tickets`

### Verificar desde el Backend

1. Abre: `https://rifasdelasuerte-production.up.railway.app/api/health`
2. Si responde → El backend está funcionando
3. Intenta acceder al panel admin:
   - Ve a tu frontend en Netlify
   - Intenta iniciar sesión
   - Si funciona → Las tablas están creadas

---

## 🆘 PROBLEMAS COMUNES

### Error: "Migration failed"

**Causa:** Puede haber un conflicto con migraciones anteriores.

**Solución:**
1. Verifica los logs en Railway
2. Busca el error específico
3. Si dice que una tabla ya existe, puedes:
   - Marcar la migración como aplicada: `npx prisma migrate resolve --applied <nombre-migracion>`
   - O usar: `npx prisma db push` (crea las tablas directamente sin historial)

### Error: "Cannot connect to database"

**Causa:** La `DATABASE_URL` es incorrecta o la base de datos no está accesible.

**Solución:**
1. Verifica que `DATABASE_URL` sea correcta en Railway
2. Verifica que la base de datos esté activa
3. Verifica que Railway haya conectado automáticamente la base de datos

### Error: "No migrations found"

**Causa:** Las migraciones no están en el repositorio o no se subieron a GitHub.

**Solución:**
1. Verifica que `backend/prisma/migrations` esté en GitHub
2. Haz push si falta:
   ```bash
   git add backend/prisma/migrations
   git commit -m "Add migrations"
   git push
   ```

---

## 📝 MIGRACIONES DISPONIBLES

Según tu proyecto, deberías tener estas migraciones:

1. `20250924231524_init` - Migración inicial (crea todas las tablas básicas)
2. `20250117000000_add_text_color_fields` - Agrega campos de colores de texto
3. Otras migraciones según tu proyecto

---

## ✅ CHECKLIST

- [ ] Migraciones ejecutadas en Railway
- [ ] Tablas creadas en la base de datos
- [ ] Backend responde correctamente (`/api/health`)
- [ ] Panel admin accesible
- [ ] Puedes crear rifas y órdenes

---

## 🎯 COMANDO RÁPIDO

**Para ejecutar migraciones en Railway:**

```bash
cd backend && npx prisma migrate deploy
```

**Para verificar estado:**

```bash
cd backend && npx prisma migrate status
```

---

## 💡 TIP IMPORTANTE

**Las migraciones solo necesitan ejecutarse UNA VEZ** cuando configuras la base de datos por primera vez.

Después de eso:
- Las migraciones futuras se ejecutarán automáticamente si haces cambios
- O puedes ejecutarlas manualmente cuando agregues nuevas tablas/campos

---

**¿Ya ejecutaste las migraciones? Si no, sigue el Método 1 arriba.**

