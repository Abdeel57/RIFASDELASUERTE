#!/usr/bin/env node

/**
 * Script interactivo para configurar un nuevo cliente
 * Uso: node scripts/setup-new-client.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function log(message, color = 'reset') {
  const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    red: '\x1b[31m'
  };
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function setupNewClient() {
  console.log('\n🚀 Configuración de Nuevo Cliente\n');
  console.log('Necesito algunos datos para configurar la nueva página:\n');

  // 1. Nombre del cliente
  const clientName = await question('📌 Nombre del cliente/empresa: ');
  if (!clientName.trim()) {
    log('❌ El nombre es requerido', 'red');
    rl.close();
    process.exit(1);
  }

  // 2. Dominio (opcional)
  const domain = await question('🌐 Dominio del cliente (opcional, presiona Enter si no lo tienes): ');
  const hasDomain = domain.trim() !== '';

  // 3. Base de datos
  log('\n💾 Configuración de Base de Datos:', 'blue');
  log('   Puedes crear una en: Railway (railway.app) o Supabase (supabase.com)', 'yellow');
  const databaseUrl = await question('📡 URL de PostgreSQL (DATABASE_URL): ');
  if (!databaseUrl.trim()) {
    log('⚠️  No ingresaste URL de base de datos. Deberás configurarla manualmente en backend/.env', 'yellow');
  }

  // 4. Usuario admin
  const adminUsername = await question('\n👤 Usuario administrador (ej: admin): ') || 'admin';
  const adminPassword = await question('🔐 Contraseña del administrador: ');
  const adminEmail = await question('📧 Email del administrador (opcional): ') || '';
  const adminName = await question('👨‍💼 Nombre del administrador: ') || 'Administrador Principal';

  // 5. JWT Secret
  const crypto = require('crypto');
  const jwtSecret = crypto.randomBytes(32).toString('hex');

  log('\n⚙️  Configurando archivos...\n', 'blue');

  // Crear carpeta del cliente
  const clientFolderName = clientName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const clientPath = path.join(__dirname, '..', '..', `${clientFolderName}-rifas`);

  log(`📁 Creando carpeta: ${clientFolderName}-rifas`, 'blue');

  // Copiar archivos (simulamos, en realidad necesitarías copiar toda la carpeta)
  log('⚠️  IMPORTANTE: Debes copiar manualmente toda la carpeta del proyecto', 'yellow');
  log(`   Desde: ${path.join(__dirname, '..')}`, 'yellow');
  log(`   Hacia: ${clientPath}`, 'yellow');
  log('   Luego ejecuta este script desde la nueva carpeta\n', 'yellow');

  // Crear .env
  const envPath = path.join(__dirname, '..', 'backend', '.env');
  if (fs.existsSync(envPath)) {
    log('⚠️  El archivo backend/.env ya existe. Se creará una copia de respaldo.', 'yellow');
    fs.copyFileSync(envPath, `${envPath}.backup-${Date.now()}`);
  }

  if (databaseUrl.trim()) {
    const envContent = `# Base de datos PostgreSQL
DATABASE_URL="${databaseUrl.trim()}"

# Puerto del servidor
PORT=3000

# Entorno
NODE_ENV=development

# JWT Secret (generado automáticamente)
JWT_SECRET="${jwtSecret}"

# Dominio del cliente (opcional)
CLIENT_DOMAIN="${domain.trim() || ''}"
`;

    fs.writeFileSync(envPath, envContent);
    log('✅ backend/.env creado', 'green');
  } else {
    // Crear .env con valores por defecto
    const envContent = `# Base de datos PostgreSQL
# ⚠️ IMPORTANTE: Configura tu DATABASE_URL aquí
DATABASE_URL="postgresql://user:password@host:port/database"

# Puerto del servidor
PORT=3000

# Entorno
NODE_ENV=development

# JWT Secret (generado automáticamente)
JWT_SECRET="${jwtSecret}"

# Dominio del cliente (opcional)
CLIENT_DOMAIN="${domain.trim() || ''}"
`;
    fs.writeFileSync(envPath, envContent);
    log('✅ backend/.env creado (debes configurar DATABASE_URL manualmente)', 'yellow');
  }

  // Actualizar main.ts con dominios
  if (hasDomain) {
    const mainTsPath = path.join(__dirname, '..', 'backend', 'src', 'main.ts');
    if (fs.existsSync(mainTsPath)) {
      let mainTs = fs.readFileSync(mainTsPath, 'utf8');
      
      // Buscar la sección de dominios de clientes
      const domainSection = `    // Cliente: ${clientName}
    'https://${domain}',
    'https://www.${domain}',
    'http://${domain}',
    'http://www.${domain}',`;
      
      // Insertar después del comentario "DOMINIOS DE CLIENTES"
      const insertPoint = mainTs.indexOf('// ============================================');
      if (insertPoint !== -1) {
        const nextComment = mainTs.indexOf('// Cliente:', insertPoint + 50);
        if (nextComment !== -1) {
          mainTs = mainTs.slice(0, nextComment) + domainSection + '\n    \n    ' + mainTs.slice(nextComment);
        } else {
          // Insertar antes del cierre del array
          const arrayEnd = mainTs.lastIndexOf('  ];');
          if (arrayEnd !== -1) {
            mainTs = mainTs.slice(0, arrayEnd) + '    ' + domainSection + '\n' + mainTs.slice(arrayEnd);
          }
        }
        fs.writeFileSync(mainTsPath, mainTs);
        log('✅ backend/src/main.ts actualizado con dominios', 'green');
      }
    }
  }

  // Crear script de creación de usuario (Windows .bat)
  const createUserBatPath = path.join(__dirname, '..', 'CREAR-ADMIN-CLIENTE.bat');
  const batContent = `@echo off
echo.
echo ========================================
echo Creando usuario administrador...
echo Cliente: ${clientName}
echo ========================================
echo.
node backend\\scripts\\create-admin-user.js ${adminUsername} ${adminPassword} ${adminEmail || 'admin@cliente.com'} "${adminName}"
echo.
echo ========================================
echo Usuario creado exitosamente!
echo ========================================
pause
`;
  fs.writeFileSync(createUserBatPath, batContent);
  log('✅ CREAR-ADMIN-CLIENTE.bat creado', 'green');

  // Guardar configuración en config-cliente.json
  const configPath = path.join(__dirname, '..', 'config-cliente.json');
  const config = {
    clientName: clientName,
    domain: domain.trim() || '',
    databaseUrl: databaseUrl.trim() || '',
    admin: {
      username: adminUsername,
      password: adminPassword,
      email: adminEmail || 'admin@cliente.com',
      name: adminName
    },
    jwtSecret: jwtSecret,
    createdAt: new Date().toISOString()
  };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  log('✅ config-cliente.json guardado', 'green');

  log('\n✅ Configuración completada!\n', 'green');
  log('📋 Resumen:', 'blue');
  log(`   Cliente: ${clientName}`, 'green');
  if (hasDomain) {
    log(`   Dominio: ${domain}`, 'green');
  }
  log(`   Usuario admin: ${adminUsername}`, 'green');
  log(`   JWT Secret: ${jwtSecret.substring(0, 20)}...`, 'green');
  
  log('\n📝 Próximos pasos:', 'yellow');
  
  if (!databaseUrl.trim()) {
    log('1. ⚠️  Configura la URL de la base de datos en backend/.env', 'yellow');
    log('   Puedes crear una gratis en: Railway (railway.app) o Supabase (supabase.com)', 'blue');
  }
  
  log(`${databaseUrl.trim() ? '1' : '2'}. Ejecuta las migraciones de la base de datos:`, 'blue');
  log('   cd backend && npm run migrate:deploy', 'blue');
  
  log(`${databaseUrl.trim() ? '2' : '3'}. Crea el usuario administrador:`, 'blue');
  log('   Ejecuta: CREAR-ADMIN-CLIENTE.bat', 'blue');
  log('   O manualmente:', 'blue');
  log(`   node backend/scripts/create-admin-user.js ${adminUsername} ${adminPassword} ${adminEmail || 'admin@cliente.com'} "${adminName}"`, 'blue');
  
  log(`${databaseUrl.trim() ? '3' : '4'}. Inicia la aplicación:`, 'blue');
  log('   npm start', 'blue');
  
  log(`${databaseUrl.trim() ? '4' : '5'}. Accede al panel de administración:`, 'blue');
  log('   http://localhost:5173/#/admin', 'blue');
  log(`   Usuario: ${adminUsername}`, 'blue');
  log(`   Contraseña: ${adminPassword}`, 'blue');
  
  log('\n🎉 ¡Configuración completada para el nuevo cliente!', 'green');
  log(`\n💾 Toda la configuración se guardó en: config-cliente.json`, 'blue');
  
  rl.close();
}

setupNewClient().catch((error) => {
  log(`\n❌ Error: ${error.message}`, 'red');
  rl.close();
  process.exit(1);
});

