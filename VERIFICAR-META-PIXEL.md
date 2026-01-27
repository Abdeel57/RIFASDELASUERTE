# Guía para Verificar Meta Pixel

## Pasos para Verificar que el Pixel Está Funcionando

### 1. Verificar que el Pixel se Carga Correctamente

1. Abre tu página web en el navegador
2. Abre las **Herramientas de Desarrollador** (F12)
3. Ve a la pestaña **Console**
4. Deberías ver este mensaje: `✅ Meta Pixel inicializado con ID: 939571728774749`

### 2. Verificar que los Eventos se Disparan

#### Evento PageView (al cargar la página):
- Deberías ver en la consola: `📊 Meta Pixel Event: PageView`

#### Evento AddToCart (al seleccionar un boleto):
- Selecciona un boleto en la página de detalles de la rifa
- Deberías ver: `🛒 Disparando evento AddToCart para Meta Pixel`
- Y luego: `📊 Meta Pixel Event: AddToCart`

#### Evento InitiateCheckout (al hacer click en "Apartar"):
- Llena el formulario y haz click en "Apartar"
- Deberías ver: `🛒 Disparando evento InitiateCheckout para Meta Pixel`
- Y luego: `📊 Meta Pixel Event: InitiateCheckout`

### 3. Verificar en la Pestaña Network

1. En las Herramientas de Desarrollador, ve a la pestaña **Network**
2. Filtra por: `fbevents`
3. Deberías ver peticiones a: `https://www.facebook.com/tr/`
4. Haz click en una petición y verifica:
   - **Status**: Debe ser `200 OK`
   - **Request URL**: Debe contener tu Pixel ID `939571728774749`

### 4. Verificar con Facebook Pixel Helper

1. Instala la extensión **Facebook Pixel Helper** en Chrome
2. Visita tu página web
3. La extensión mostrará:
   - ✅ Si el pixel está instalado correctamente
   - ⚠️ Si hay algún problema
   - 📊 Los eventos que se están disparando

### 5. Verificar en Facebook Events Manager

1. Ve a [Facebook Events Manager](https://business.facebook.com/events_manager2)
2. Selecciona tu Pixel: `939571728774749`
3. Ve a la pestaña **Test Events**
4. Visita tu página y realiza acciones
5. Deberías ver los eventos aparecer en tiempo real

### 6. Verificar Dominio en Facebook

1. Ve a [Facebook Business Settings](https://business.facebook.com/settings)
2. Ve a **Brand Safety** > **Domains**
3. Asegúrate de que tu dominio esté agregado y verificado
4. Si no está, agrega tu dominio y sigue las instrucciones de verificación

## Problemas Comunes y Soluciones

### Problema: No veo eventos en Facebook Events Manager

**Solución:**
1. Verifica que el dominio esté agregado en Facebook Business Settings
2. Espera 15-20 minutos (los eventos pueden tardar en aparecer)
3. Asegúrate de estar usando el mismo navegador donde iniciaste sesión en Facebook
4. Verifica que no tengas bloqueadores de anuncios activos

### Problema: El pixel no se inicializa

**Solución:**
1. Verifica en la consola si hay errores
2. Verifica que el script del pixel esté en el `<head>` del HTML
3. Verifica que no haya conflictos con otros scripts

### Problema: Los eventos no se disparan

**Solución:**
1. Verifica en la consola los logs de depuración
2. Verifica que `window.fbq` esté definido: `console.log(window.fbq)`
3. Verifica que el servicio `metaPixelService` esté inicializado

## Comandos de Verificación en la Consola

Abre la consola del navegador y ejecuta:

```javascript
// Verificar que fbq existe
console.log('fbq existe:', typeof window.fbq !== 'undefined');

// Verificar el ID del pixel
console.log('Pixel ID:', window.fbq ? '939571728774749' : 'No inicializado');

// Disparar un evento de prueba manualmente
if (window.fbq) {
  window.fbq('track', 'PageView');
  console.log('✅ Evento PageView disparado manualmente');
}
```

## Contacto

Si después de seguir estos pasos aún no ves los eventos, verifica:
1. Que el dominio esté correctamente configurado en Facebook
2. Que no haya bloqueadores de anuncios
3. Que el código se haya desplegado correctamente


