#!/usr/bin/env node

/**
 * Script para probar el login directamente
 * Uso: node test-login.js <username> <password>
 */

// Node 18+ tiene fetch global. No usamos node-fetch (ESM) para evitar errores en require().
const fetchFn = globalThis.fetch;
if (typeof fetchFn !== 'function') {
  console.error('❌ Este script requiere Node.js 18+ (fetch global).');
  process.exit(1);
}

async function testLogin() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('❌ Uso: node test-login.js <username> <password>');
    console.log('');
    console.log('Ejemplo:');
    console.log('  node test-login.js admin admin123');
    process.exit(1);
  }

  const username = args[0];
  const password = args[1];
  const apiUrl = process.env.API_URL || 'https://rifasdelasuerte-production.up.railway.app/api';

  try {
    console.log('🔐 Probando login...');
    console.log(`   Usuario: ${username}`);
    console.log(`   API URL: ${apiUrl}/admin/login`);
    console.log('');

    const response = await fetchFn(`${apiUrl}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    console.log(`📡 Status Code: ${response.status}`);
    console.log(`📡 Status Text: ${response.statusText}`);
    console.log('');

    const responseText = await response.text();
    console.log('📋 Response Body:');
    console.log(responseText);
    console.log('');

    if (response.ok) {
      const result = JSON.parse(responseText);
      console.log('✅ Login exitoso!');
      console.log('   Token recibido:', result.data?.access_token ? 'Sí' : 'No');
      console.log('   Usuario:', result.data?.user?.username || result.data?.username);
    } else {
      console.log('❌ Login falló');
      try {
        const error = JSON.parse(responseText);
        console.log('   Error:', error.message || error.error);
      } catch {
        console.log('   Error:', responseText);
      }
    }

  } catch (error) {
    console.error('❌ Error al probar login:', error.message);
    console.error('   Stack:', error.stack);
    process.exit(1);
  }
}

testLogin();

