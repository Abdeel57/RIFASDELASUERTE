#!/usr/bin/env node

/**
 * Script para actualizar la contraseña de un usuario administrador existente
 * Uso: node update-admin-password.js <username> <new-password>
 */

const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateAdminPassword() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('❌ Uso: node update-admin-password.js <username> <new-password>');
    console.log('');
    console.log('Ejemplo:');
    console.log('  node update-admin-password.js admin NuevaPassword123');
    process.exit(1);
  }

  const username = args[0];
  const newPassword = args[1];

  try {
    console.log('🔐 Actualizando contraseña de usuario administrador...');
    console.log(`   Usuario: ${username}`);

    // Verificar si el usuario existe
    const existingUser = await prisma.adminUser.findUnique({
      where: { username }
    });

    if (!existingUser) {
      console.log(`❌ Usuario '${username}' no encontrado.`);
      process.exit(1);
    }

    console.log(`✅ Usuario encontrado: ${existingUser.name}`);

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña
    const updatedUser = await prisma.adminUser.update({
      where: { username },
      data: {
        password: hashedPassword
      }
    });

    console.log('✅ Contraseña actualizada exitosamente!');
    console.log('');
    console.log('📋 Credenciales actualizadas:');
    console.log(`   Usuario: ${updatedUser.username}`);
    console.log(`   Contraseña: ${newPassword}`);
    console.log('');

  } catch (error) {
    console.error('❌ Error al actualizar contraseña:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword();

