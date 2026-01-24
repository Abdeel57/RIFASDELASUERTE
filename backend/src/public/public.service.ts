import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
// FIX: Using `import type` for Prisma namespace and a value import for the OrderStatus enum.
import { type Prisma } from '@prisma/client';
import { add } from 'date-fns';

@Injectable()
export class PublicService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  // Helper para asegurar que la tabla users existe y tiene todas las columnas
  private async ensureUsersTable() {
    try {
      // Verificar si la tabla existe
      await this.prisma.$queryRaw`SELECT 1 FROM "users" LIMIT 1`;
      
      // Verificar columnas necesarias
      const columnsToCheck = ['phone', 'district'];
      for (const col of columnsToCheck) {
        const colResult = await this.prisma.$queryRaw<Array<{column_name: string}>>`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = ${col}
        `;
        
        if (colResult.length === 0) {
          console.warn(`⚠️ users table missing ${col} column, adding it...`);
          await this.prisma.$executeRawUnsafe(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "${col}" TEXT;`);
        }
      }
    } catch (error: any) {
      const isTableError = error.code === 'P2021' || 
                          error.code === '42P01' || 
                          error.message?.includes('does not exist') ||
                          error.message?.includes('Unknown table') ||
                          (error.message?.includes('relation') && error.message?.includes('does not exist'));
      
      if (isTableError) {
        console.warn('⚠️ users table does not exist, creating it...');
        await this.prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "users" (
              "id" TEXT NOT NULL,
              "email" TEXT NOT NULL,
              "name" TEXT,
              "phone" TEXT,
              "district" TEXT,
              "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              CONSTRAINT "users_pkey" PRIMARY KEY ("id")
          );
        `;
        
        await this.prisma.$executeRaw`
          CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
        `;
        
        console.log('✅ users table created successfully');
      } else {
        throw error;
      }
    }
  }

  // Helper para asegurar que la tabla raffles existe (versión simplificada)
  private async ensureRafflesTable() {
    try {
      await this.prisma.$queryRaw`SELECT 1 FROM "raffles" LIMIT 1`;
    } catch (error: any) {
      // Si la tabla no existe, solo loguear el error pero no crear (debe ser creada por AdminService)
      console.warn('⚠️ raffles table does not exist');
    }
  }

  // Helper para asegurar que la tabla orders existe
  private async ensureOrdersTable() {
    try {
      // Primero asegurar que OrderStatus enum existe
      await this.prisma.$executeRaw`
        DO $$ 
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'OrderStatus') THEN
                CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'EXPIRED', 'RELEASED');
                RAISE NOTICE 'Enum OrderStatus creado';
            END IF;
        END $$;
      `;
      
      await this.prisma.$queryRaw`SELECT 1 FROM "orders" LIMIT 1`;
    } catch (error: any) {
      const isTableError = error.code === 'P2021' || 
                          error.code === '42P01' || 
                          error.message?.includes('does not exist') ||
                          error.message?.includes('Unknown table') ||
                          (error.message?.includes('relation') && error.message?.includes('does not exist'));
      
      if (isTableError) {
        console.warn('⚠️ orders table does not exist, creating it...');
        
        // Asegurar que users existe primero
        await this.ensureUsersTable();
        await this.ensureRafflesTable();
        
        await this.prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "orders" (
              "id" TEXT NOT NULL,
              "folio" TEXT NOT NULL,
              "raffleId" TEXT NOT NULL,
              "userId" TEXT NOT NULL,
              "tickets" INTEGER[] NOT NULL DEFAULT '{}',
              "total" DOUBLE PRECISION NOT NULL,
              "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
              "paymentMethod" TEXT,
              "notes" TEXT,
              "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
              "expiresAt" TIMESTAMP(3) NOT NULL,
              CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
          );
        `;
        
        await this.prisma.$executeRaw`
          CREATE UNIQUE INDEX IF NOT EXISTS "orders_folio_key" ON "orders"("folio");
        `;
        
        await this.prisma.$executeRaw`
          CREATE INDEX IF NOT EXISTS "orders_raffleId_idx" ON "orders"("raffleId");
        `;
        
        await this.prisma.$executeRaw`
          CREATE INDEX IF NOT EXISTS "orders_userId_idx" ON "orders"("userId");
        `;
        
        await this.prisma.$executeRaw`
          CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders"("status");
        `;
        
        console.log('✅ orders table created successfully');
      } else {
        throw error;
      }
    }
  }

  async getActiveRaffles() {
    const cacheKey = 'raffles:active';
    
    // Intentar obtener del cache
    const cached = await this.cacheService.get<any[]>(cacheKey);
    if (cached) {
      console.log('✅ Rifas activas obtenidas del cache');
      return cached;
    }

    // Si no está en cache, obtener de DB
    const raffles = await this.prisma.raffle.findMany({
      where: { status: 'active' },
      orderBy: { drawDate: 'asc' }, // Ordenar por fecha de sorteo (más próximas primero)
    });

    // Guardar en cache (TTL: 5 minutos = 300 segundos)
    await this.cacheService.set(cacheKey, raffles, 300);
    console.log('💾 Rifas activas guardadas en cache');

    return raffles;
  }

  async getRaffleBySlug(slug: string) {
    const cacheKey = `raffle:slug:${slug}`;
    
    // Intentar obtener del cache
    const cached = await this.cacheService.get<any>(cacheKey);
    if (cached) {
      console.log(`✅ Rifa ${slug} obtenida del cache`);
      return cached;
    }

    // Si no está en cache, obtener de DB
    const raffle = await this.prisma.raffle.findUnique({
      where: { slug },
    });

    if (raffle) {
      // Guardar en cache (TTL: 5 minutos)
      await this.cacheService.set(cacheKey, raffle, 300);
      console.log(`💾 Rifa ${slug} guardada en cache`);
    }

    return raffle;
  }

  async getOccupiedTickets(
    raffleId: string,
    options?: {
      offset?: number;
      limit?: number;
      sortDirection?: 'asc' | 'desc';
    },
  ) {
    // Asegurar que orders existe
    await this.ensureOrdersTable();
    
    const offset = Math.max(0, options?.offset ?? 0);
    const rawLimit = options?.limit;
    const limit = typeof rawLimit === 'number' && rawLimit > 0 ? Math.min(rawLimit, 2000) : undefined;
    const sortDirection = options?.sortDirection === 'desc' ? 'desc' : 'asc';

    // Obtener todas las órdenes activas (PAID y PENDING)
    // IMPORTANTE: Excluir CANCELLED y EXPIRED para que esos boletos estén disponibles
    const orders = await this.prisma.order.findMany({
      where: {
        raffleId,
        status: { in: ['PAID', 'PENDING'] },
      },
      select: { 
        tickets: true,
        status: true,
        id: true,
      },
    });

    // Extraer todos los boletos de las órdenes activas
    const allTickets = orders.flatMap(o => {
      // Asegurar que tickets es un array de números
      if (Array.isArray(o.tickets)) {
        return o.tickets.filter((ticket): ticket is number => 
          typeof ticket === 'number' && !isNaN(ticket) && ticket > 0
        );
      }
      return [];
    });

    // Eliminar duplicados (por si acaso hay algún problema de datos)
    const uniqueTickets = Array.from(new Set(allTickets));

    const sortedTickets = sortDirection === 'desc'
      ? [...uniqueTickets].sort((a, b) => b - a)
      : [...uniqueTickets].sort((a, b) => a - b);

    const total = sortedTickets.length;

    if (!limit) {
      return {
        tickets: sortedTickets,
        total,
        hasMore: false,
        nextOffset: null,
      };
    }

    const start = Math.min(offset, Math.max(total - 1, 0));
    const end = Math.min(start + limit, total);
    const pageTickets = sortedTickets.slice(start, end);
    const nextOffset = end < total ? end : null;

    return {
      tickets: pageTickets,
      total,
      hasMore: end < total,
      nextOffset,
    };
  }

  // Método de diagnóstico para verificar el estado de un boleto específico
  async checkTicketStatus(raffleId: string, ticketNumber: number) {
    await this.ensureOrdersTable();
    
    const orders = await this.prisma.order.findMany({
      where: {
        raffleId,
      },
      select: {
        id: true,
        folio: true,
        status: true,
        tickets: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            phone: true,
          },
        },
      },
    });

    const ticketInfo = {
      ticketNumber,
      raffleId,
      isOccupied: false,
      isAvailable: false,
      orders: [] as Array<{
        orderId: string;
        folio: string;
        status: string;
        createdAt: Date;
        customer?: { name: string | null; phone: string | null };
      }>,
    };

    orders.forEach(order => {
      if (Array.isArray(order.tickets) && order.tickets.includes(ticketNumber)) {
        ticketInfo.isOccupied = true;
        ticketInfo.orders.push({
          orderId: order.id,
          folio: order.folio,
          status: order.status,
          createdAt: order.createdAt,
          customer: order.user || undefined,
        });
      }
    });

    // Determinar si está disponible (no está en órdenes activas)
    const activeOrders = ticketInfo.orders.filter(o => o.status === 'PAID' || o.status === 'PENDING');
    ticketInfo.isAvailable = activeOrders.length === 0;

    return ticketInfo;
  }

  async getPastWinners() {
    const cacheKey = 'winners:all';
    
    // Intentar obtener del cache
    const cached = await this.cacheService.get<any[]>(cacheKey);
    if (cached) {
      console.log('✅ Ganadores obtenidos del cache');
      return cached;
    }

    // Si no está en cache, obtener de DB
    const winners = await this.prisma.winner.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Guardar en cache (TTL: 15 minutos = 900 segundos)
    await this.cacheService.set(cacheKey, winners, 900);
    console.log('💾 Ganadores guardados en cache');

    return winners;
  }

  async getSettings() {
    const cacheKey = 'settings:main';
    
    try {
      // Intentar obtener del cache
      const cached = await this.cacheService.get<any>(cacheKey);
      if (cached) {
        console.log('✅ Settings obtenidos del cache');
        return this.formatSettingsResponse(cached);
      }

      console.log('🔧 Getting settings from database...');
      
      const settings = await this.prisma.settings.findUnique({
        where: { id: 'main_settings' },
      });
      
      if (!settings) {
        console.log('⚠️ No settings found, creating default settings');
        // Create default settings if they don't exist
        const newSettings = await this.prisma.settings.create({
          data: {
            id: 'main_settings',
            siteName: 'Lucky Snap',
            logoAnimation: 'rotate',
            primaryColor: '#111827',
            secondaryColor: '#1f2937',
            accentColor: '#ec4899',
            actionColor: '#0ea5e9',
            paymentAccounts: JSON.stringify([]),
            faqs: JSON.stringify([]),
          },
        });
        
        // Guardar en cache (TTL: 30 minutos = 1800 segundos)
        await this.cacheService.set(cacheKey, newSettings, 1800);
        console.log('💾 Settings guardados en cache');
        
        return this.formatSettingsResponse(newSettings);
      }

      // Guardar en cache (TTL: 30 minutos = 1800 segundos)
      await this.cacheService.set(cacheKey, settings, 1800);
      console.log('💾 Settings guardados en cache');
      
      console.log('✅ Settings found:', settings);
      return this.formatSettingsResponse(settings);
    } catch (error) {
      console.error('❌ Error getting settings:', error);
      // Return default settings if there's an error
      return {
        id: 'main_settings',
        siteName: 'Lucky Snap',
        appearance: {
          siteName: 'Lucky Snap',
          logoAnimation: 'rotate',
          colors: {
            backgroundPrimary: '#111827',
            backgroundSecondary: '#1f2937',
            accent: '#ec4899',
            action: '#0ea5e9',
          }
        },
        contactInfo: {
          whatsapp: '',
          email: '',
          emailFromName: '',
          emailReplyTo: '',
          emailSubject: '',
        },
        socialLinks: {
          facebookUrl: '',
          instagramUrl: '',
          tiktokUrl: '',
        },
        paymentAccounts: [],
        faqs: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  }

  private formatSettingsResponse(settings: any) {
    return {
      id: settings.id,
      siteName: settings.siteName,
      appearance: {
        siteName: settings.siteName,
        logo: settings.logo,
        favicon: settings.favicon,
        logoAnimation: settings.logoAnimation || 'rotate',
        colors: {
          backgroundPrimary: settings.primaryColor || '#111827',
          backgroundSecondary: settings.secondaryColor || '#1f2937',
          accent: settings.accentColor || '#ec4899',
          action: settings.actionColor || '#0ea5e9',
          // Nuevos campos opcionales de color de texto
          titleColor: settings.titleColor || undefined,
          subtitleColor: settings.subtitleColor || undefined,
          descriptionColor: settings.descriptionColor || undefined,
        }
      },
      contactInfo: {
        whatsapp: settings.whatsapp || '',
        email: settings.email || '',
        emailFromName: settings.emailFromName || '',
        emailReplyTo: settings.emailReplyTo || '',
        emailSubject: settings.emailSubject || '',
      },
      socialLinks: {
        facebookUrl: settings.facebookUrl || '',
        instagramUrl: settings.instagramUrl || '',
        tiktokUrl: settings.tiktokUrl || '',
      },
      paymentAccounts: this.parseJsonField(settings.paymentAccounts),
      faqs: this.parseJsonField(settings.faqs),
      displayPreferences: this.parseJsonField(settings.displayPreferences),
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt,
    };
  }

  private parseJsonField(field: any) {
    try {
      if (!field) return [];
      
      // Handle double serialization
      if (typeof field === 'string') {
        // Try to parse as JSON
        const parsed = JSON.parse(field);
        
        // If it's still a string, parse again
        if (typeof parsed === 'string') {
          return JSON.parse(parsed);
        }
        
        return parsed;
      }
      
      return field;
    } catch (error) {
      console.error('❌ Error parsing JSON field:', error);
      return [];
    }
  }

  async testDatabaseConnection() {
    try {
      // Simple query to test database connection
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      throw error;
    }
  }

  async createOrder(orderData: any) {
    // Asegurar que las tablas necesarias existen PRIMERO
    try {
      await this.ensureOrdersTable();
      await this.ensureUsersTable();
      await this.ensureRafflesTable();
    } catch (error: any) {
      console.error('❌ Error ensuring tables:', error);
      throw new Error(`Error al inicializar tablas: ${error.message}`);
    }
    
    try {
      console.log('📝 Creating order with data:', orderData);
      
      // Verificar que la rifa existe
      const raffle = await this.prisma.raffle.findUnique({ where: { id: orderData.raffleId } });
      if (!raffle) {
        throw new NotFoundException('Raffle not found');
      }
      
      console.log('✅ Raffle found:', raffle.title);
      
      // Lógica de múltiples oportunidades
      let ticketsToSave = orderData.tickets;
      if (raffle.boletosConOportunidades && raffle.numeroOportunidades > 1) {
        console.log(`🎁 Generando boletos adicionales: ${raffle.numeroOportunidades - 1} por cada boleto comprado`);
        
        const totalEmisiones = raffle.tickets * raffle.numeroOportunidades;
        const boletosAdicionales: number[] = [];
        
        // Obtener todas las órdenes existentes para evitar duplicados
        const existingOrders = await this.prisma.order.findMany({
          where: { raffleId: orderData.raffleId },
          select: { tickets: true }
        });
        
        const ticketsUsados = new Set<number>();
        existingOrders.forEach(order => {
          order.tickets.forEach(ticket => ticketsUsados.add(ticket));
        });
        
        // Añadir tickets de esta orden a los usados
        orderData.tickets.forEach(ticket => ticketsUsados.add(ticket));
        
        console.log(`📊 Tickets ya usados: ${ticketsUsados.size}`);
        console.log(`📊 Rango total de emisiones: ${totalEmisiones}`);
        
        // Para cada boleto comprado, generar boletos adicionales aleatorios
        for (const ticketNum of orderData.tickets) {
          for (let i = 0; i < raffle.numeroOportunidades - 1; i++) {
            // Generar número aleatorio del rango extendido (tickets + 1 hasta totalEmisiones)
            let randomTicket: number;
            let attempts = 0;
            const maxAttempts = 1000; // Aumentado para escalas grandes
            
            do {
              randomTicket = Math.floor(Math.random() * (totalEmisiones - raffle.tickets) + raffle.tickets + 1);
              attempts++;
              
              // Prevenir bucle infinito
              if (attempts > maxAttempts) {
                console.warn(`⚠️ No se pudo generar boleto único después de ${maxAttempts} intentos`);
                // Como último recurso, generar un número secuencial basado en timestamp
                randomTicket = raffle.tickets + (Date.now() % (totalEmisiones - raffle.tickets)) + 1;
                break;
              }
            } while (ticketsUsados.has(randomTicket) || ticketNum === randomTicket || boletosAdicionales.includes(randomTicket));
            
            if (attempts <= maxAttempts) {
              boletosAdicionales.push(randomTicket);
              ticketsUsados.add(randomTicket); // Marcar como usado
            }
          }
        }
        
        // Combinar boletos originales con los adicionales
        ticketsToSave = [...orderData.tickets, ...boletosAdicionales];
        console.log(`✅ Boletos generados: ${ticketsToSave.length} total (${orderData.tickets.length} comprados + ${boletosAdicionales.length} de regalo)`);
        console.log(`📦 Boletos de regalo asignados: ${boletosAdicionales.join(', ')}`);
      }
      
      // Crear o buscar el usuario
      let user;
      const userData = orderData.userData || {};
      
      if (userData.email) {
        // Buscar usuario existente por email
        user = await this.prisma.user.findUnique({ where: { email: userData.email } });
      }
      
      if (!user) {
        // Crear nuevo usuario
        user = await this.prisma.user.create({
          data: {
            email: userData.email || `user-${Date.now()}@temp.com`,
            name: userData.name,
            phone: userData.phone,
            district: userData.district,
          },
        });
        console.log('✅ User created:', user.id);
      } else {
        console.log('✅ Existing user found:', user.id);
      }
      
      // Crear la orden con todos los tickets (comprados + de regalo)
      const newOrder = await this.prisma.order.create({
        data: {
          folio: `LKSNP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
          raffleId: orderData.raffleId,
          userId: user.id,
          tickets: ticketsToSave, // Incluye tickets originales + boletos adicionales
          total: orderData.total,
          status: 'PENDING',
          paymentMethod: orderData.paymentMethod || 'transfer',
          notes: orderData.notes || '',
          expiresAt: add(new Date(), { hours: 24 }),
        },
        include: {
          raffle: true,
          user: true,
        },
      });

      console.log('✅ Order created:', newOrder.folio);
      console.log('📦 Tickets en la orden:', ticketsToSave.length, 'total');

      // Actualizar boletos vendidos (solo los comprados, no los de regalo)
      await this.prisma.raffle.update({
        where: { id: orderData.raffleId },
        data: { sold: { increment: Array.isArray(orderData.tickets) ? orderData.tickets.length : 0 } },
      });

      console.log('✅ Raffle updated with sold tickets');

      return newOrder;
    } catch (error: any) {
      console.error('❌ Error creating order:', error);
      console.error('❌ Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      // Si es un error de tabla, intentar crear las tablas y reintentar
      if (error.code === 'P2021' || error.code === '42P01' || error.message?.includes('does not exist')) {
        console.warn('⚠️ Table error detected, attempting to fix...');
        try {
          await this.ensureOrdersTable();
          await this.ensureUsersTable();
          await this.ensureRafflesTable();
          // No reintentar automáticamente, solo loguear
          console.log('✅ Tables ensured, but order creation failed. Please retry.');
        } catch (ensureError) {
          console.error('❌ Error ensuring tables:', ensureError);
        }
      }
      
      throw new Error(`Error al crear la orden: ${error.message || 'Error desconocido'}`);
    }
  }

  async verifyTicket(data: { codigo_qr?: string; numero_boleto?: number; sorteo_id?: string }) {
    try {
      console.log('🔍 Verifying ticket:', data);

      let ticketNumber: number;
      let raffleId: string;

      // Si viene código QR, decodificarlo
      if (data.codigo_qr) {
        try {
          const qrData = JSON.parse(data.codigo_qr);
          ticketNumber = qrData.numero_boleto;
          raffleId = qrData.sorteo_id;
          console.log('📱 QR decoded:', { ticketNumber, raffleId });
        } catch (error) {
          throw new Error('Código QR inválido');
        }
      } else if (data.numero_boleto && data.sorteo_id) {
        ticketNumber = data.numero_boleto;
        raffleId = data.sorteo_id;
      } else {
        throw new Error('Se requiere código QR o número de boleto con ID de sorteo');
      }

      // Buscar la orden que contiene este boleto
      const order = await this.prisma.order.findFirst({
        where: {
          raffleId,
          tickets: {
            has: ticketNumber
          }
        },
        include: {
          user: true,
          raffle: true
        }
      });

      if (!order) {
        return {
          valido: false,
          mensaje: 'Boleto no encontrado',
          boleto: null
        };
      }

      // Verificar estado del boleto
      const isValid = order.status === 'PAID';
      const message = isValid 
        ? 'Boleto válido y pagado' 
        : order.status === 'PENDING' 
          ? 'Boleto apartado pero no pagado'
          : 'Boleto no válido';

      return {
        valido: isValid,
        mensaje: message,
        boleto: {
          numero: ticketNumber,
          sorteo: order.raffle.title,
          cliente: order.user.name || 'Sin nombre',
          estado: order.status,
          fecha_pago: order.status === 'PAID' ? order.updatedAt : null,
          folio: order.folio,
          monto: order.total
        }
      };

    } catch (error) {
      console.error('❌ Error verifying ticket:', error);
      throw error;
    }
  }

  async generateTicketQR(ticketNumber: number, raffleId: string): Promise<string> {
    try {
      const QRCode = require('qrcode');
      
      const qrData = {
        numero_boleto: ticketNumber,
        sorteo_id: raffleId,
        timestamp: new Date().toISOString()
      };

      const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));
      return qrCode;
    } catch (error) {
      console.error('❌ Error generating QR:', error);
      throw new Error('Error al generar código QR');
    }
  }

  async searchTickets(criteria: {
    numero_boleto?: number;
    nombre_cliente?: string;
    telefono?: string;
    folio?: string;
  }) {
    try {
      console.log('🔍 Searching tickets with criteria:', criteria);
      
      // Validar que al menos un criterio esté presente
      if (!criteria.numero_boleto && !criteria.nombre_cliente && !criteria.telefono && !criteria.folio) {
        throw new Error('Se requiere al menos un criterio de búsqueda');
      }
      
      const where: any = {
        // Excluir órdenes canceladas y expiradas de la búsqueda pública
        status: {
          in: ['PENDING', 'PAID']
        }
      };
      
      // Construir condiciones dinámicas
      if (criteria.numero_boleto) {
        where.tickets = {
          has: criteria.numero_boleto
        };
      }
      
      // Construir condiciones de usuario
      if (criteria.nombre_cliente || criteria.telefono) {
        where.user = {};
        
        if (criteria.nombre_cliente) {
          where.user.name = {
            contains: criteria.nombre_cliente,
            mode: 'insensitive'
          };
        }
        
        if (criteria.telefono) {
          // Limpiar teléfono: solo números
          const phoneCleaned = criteria.telefono.replace(/\D/g, '');
          where.user.phone = {
            contains: phoneCleaned
          };
        }
      }
      
      if (criteria.folio) {
        where.folio = {
          contains: criteria.folio,
          mode: 'insensitive'
        };
      }
      
      // Buscar órdenes solo de sorteos activos
      const orders = await this.prisma.order.findMany({
        where: {
          ...where,
          // Solo mostrar órdenes de rifas activas
          raffle: {
            status: 'active'
          }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              phone: true,
              district: true
            }
          },
          raffle: {
            select: {
              id: true,
              title: true,
              status: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 50 // Límite recomendado
      });
      
      if (orders.length === 0) {
        return {
          clientes: [],
          totalClientes: 0,
          totalOrdenes: 0
        };
      }
      
      // Agrupar órdenes por cliente (userId)
      const ordersByUser = new Map<string, typeof orders>();
      
      orders.forEach(order => {
        const userId = order.userId;
        if (!ordersByUser.has(userId)) {
          ordersByUser.set(userId, []);
        }
        ordersByUser.get(userId)!.push(order);
      });
      
      // Transformar a formato agrupado
      const clientesAgrupados = Array.from(ordersByUser.entries()).map(([userId, userOrders]) => {
        const primerOrder = userOrders[0];
        const totalBoletos = userOrders.reduce((sum, o) => sum + o.tickets.length, 0);
        const totalPagado = userOrders.reduce((sum, o) => sum + (o.status === 'PAID' ? o.total : 0), 0);
        
        return {
          clienteId: userId,
          nombre: primerOrder.user.name || 'Sin nombre',
          telefono: primerOrder.user.phone || 'Sin teléfono',
          distrito: primerOrder.user.district || 'Sin distrito',
          totalOrdenes: userOrders.length,
          totalBoletos: totalBoletos,
          totalPagado: totalPagado,
          ordenes: userOrders.map(order => ({
            ordenId: order.id,
            folio: order.folio,
            rifa: {
              id: order.raffle.id,
              titulo: order.raffle.title
            },
            boletos: order.tickets,
            cantidadBoletos: order.tickets.length,
            estado: order.status,
            monto: order.total,
            fechaCreacion: order.createdAt,
            fechaPago: order.status === 'PAID' ? order.updatedAt : null,
            metodoPago: (order as any).paymentMethod || null
          }))
        };
      });
      
      console.log(`✅ Found ${clientesAgrupados.length} clients with ${orders.length} orders`);
      
      return {
        clientes: clientesAgrupados,
        totalClientes: clientesAgrupados.length,
        totalOrdenes: orders.length
      };
    } catch (error) {
      console.error('❌ Error searching tickets:', error);
      throw error;
    }
  }

  async getOrderByFolio(folio: string) {
    try {
      console.log('🔍 Getting order by folio:', folio);
      
      const order = await this.prisma.order.findUnique({
        where: { folio },
        include: {
          raffle: {
            select: {
              id: true,
              title: true,
              price: true,
              status: true,
              slug: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              district: true,
            },
          },
        },
      });

      if (!order) {
        throw new NotFoundException(`Order with folio ${folio} not found`);
      }

      // Transformar los datos para que coincidan con el frontend
      const transformedOrder = {
        id: order.id,
        folio: order.folio,
        raffleId: order.raffleId,
        userId: order.userId,
        tickets: order.tickets,
        total: order.total,
        totalAmount: order.total, // Alias para compatibilidad
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        expiresAt: order.expiresAt,
        raffle: order.raffle,
        customer: {
          id: order.user.id,
          name: order.user.name || 'Sin nombre',
          phone: order.user.phone || '',
          email: order.user.email || '',
          district: order.user.district || '',
        },
      };

      console.log('✅ Order found by folio:', folio);
      return transformedOrder;
    } catch (error) {
      console.error('❌ Error getting order by folio:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Order with folio ${folio} not found`);
    }
  }
}
