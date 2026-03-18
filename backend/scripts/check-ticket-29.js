const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTicket29() {
  try {
    console.log('🔍 Verificando estado del boleto 29...\n');

    // 1. Obtener todas las rifas activas
    const activeRaffles = await prisma.raffle.findMany({
      where: { status: 'active' },
      select: {
        id: true,
        title: true,
        slug: true,
        tickets: true,
      },
    });

    if (activeRaffles.length === 0) {
      console.log('❌ No se encontraron rifas activas');
      return;
    }

    console.log(`📋 Se encontraron ${activeRaffles.length} rifa(s) activa(s):\n`);

    // 2. Para cada rifa, verificar el boleto 29
    for (const raffle of activeRaffles) {
      console.log(`\n🎯 Rifa: ${raffle.title}`);
      console.log(`   ID: ${raffle.id}`);
      console.log(`   Slug: ${raffle.slug || 'N/A'}`);
      console.log(`   Total de boletos: ${raffle.tickets}`);

      // Verificar si el boleto 29 está dentro del rango válido
      if (29 > raffle.tickets) {
        console.log(`   ⚠️  El boleto 29 está fuera del rango válido (1-${raffle.tickets})`);
        continue;
      }

      // 3. Buscar todas las órdenes que contengan el boleto 29
      const allOrders = await prisma.order.findMany({
        where: {
          raffleId: raffle.id,
        },
        select: {
          id: true,
          folio: true,
          status: true,
          tickets: true,
          total: true,
          createdAt: true,
          updatedAt: true,
          expiresAt: true,
          user: {
            select: {
              name: true,
              phone: true,
              email: true,
            },
          },
        },
      });

      // Filtrar órdenes que contengan el boleto 29
      const ordersWithTicket29 = allOrders.filter(order => {
        if (!Array.isArray(order.tickets)) return false;
        return order.tickets.includes(29);
      });

      if (ordersWithTicket29.length === 0) {
        console.log(`   ✅ El boleto 29 NO está en ninguna orden - ESTÁ DISPONIBLE`);
      } else {
        console.log(`   ❌ El boleto 29 está en ${ordersWithTicket29.length} orden(es):\n`);

        ordersWithTicket29.forEach((order, index) => {
          const isActive = order.status === 'PAID' || order.status === 'PENDING';
          const statusIcon = isActive ? '🔴' : '⚪';
          
          console.log(`   ${statusIcon} Orden #${index + 1}:`);
          console.log(`      Folio: ${order.folio}`);
          console.log(`      Estado: ${order.status} ${isActive ? '(OCUPADO)' : '(NO OCUPA - disponible)'}`);
          console.log(`      Cliente: ${order.user?.name || 'Sin nombre'}`);
          console.log(`      Teléfono: ${order.user?.phone || 'Sin teléfono'}`);
          console.log(`      Email: ${order.user?.email || 'Sin email'}`);
          console.log(`      Total: $${order.total}`);
          console.log(`      Boletos en la orden: ${Array.isArray(order.tickets) ? order.tickets.join(', ') : 'N/A'}`);
          console.log(`      Creada: ${order.createdAt.toLocaleString('es-MX')}`);
          if (order.expiresAt) {
            const now = new Date();
            const expired = order.expiresAt < now;
            console.log(`      Expira: ${order.expiresAt.toLocaleString('es-MX')} ${expired ? '(EXPIRADA)' : ''}`);
          }
          console.log('');
        });

        // Determinar si el boleto está realmente ocupado
        const activeOrders = ordersWithTicket29.filter(o => 
          o.status === 'PAID' || o.status === 'PENDING'
        );

        if (activeOrders.length === 0) {
          console.log(`   ✅ El boleto 29 NO está ocupado (todas las órdenes están canceladas/expiradas)`);
          console.log(`   ✅ El boleto 29 DEBERÍA estar disponible para compra`);
        } else {
          console.log(`   ❌ El boleto 29 ESTÁ OCUPADO por ${activeOrders.length} orden(es) activa(s)`);
          console.log(`   ❌ El boleto 29 NO está disponible para compra`);
        }
      }

      // 4. Verificar también en boletos de regalo (si la rifa tiene oportunidades)
      const raffleFull = await prisma.raffle.findUnique({
        where: { id: raffle.id },
        select: {
          boletosConOportunidades: true,
          numeroOportunidades: true,
        },
      });

      if (raffleFull?.boletosConOportunidades && raffleFull?.numeroOportunidades > 1) {
        const maxGiftTicket = raffle.tickets * raffleFull.numeroOportunidades;
        if (29 > raffle.tickets && 29 <= maxGiftTicket) {
          console.log(`   📌 Nota: El boleto 29 podría ser un boleto de regalo (rango: ${raffle.tickets + 1}-${maxGiftTicket})`);
        }
      }
    }

    console.log('\n✅ Verificación completada\n');

  } catch (error) {
    console.error('❌ Error al verificar el boleto 29:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
checkTicket29();



