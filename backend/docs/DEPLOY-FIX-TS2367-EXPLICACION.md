# Análisis del fallo de deploy (TS2367) y corrección

## 1. Qué falló

El build en Railway fallaba con:

```
src/admin/admin.service.ts:733:47 - error TS2367: This comparison appears to be unintentional 
because the types '"PENDING"' and '"COMPLETED"' have no overlap.
733       if (createOrderDto.status === 'PAID' || createOrderDto.status === 'COMPLETED') {
                                                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

**Traducción:** TypeScript considera que la comparación es incorrecta porque el tipo de `createOrderDto.status` **nunca** puede ser `'COMPLETED'`, así que comparar con `'COMPLETED'` no tiene sentido.

---

## 2. Contrato del DTO (origen del tipo)

En `create-order-manual.dto.ts` el campo `status` está definido así:

```ts
@IsEnum(['PENDING', 'PAID'], { message: 'El estado debe ser PENDING o PAID' })
@IsOptional()
status?: 'PENDING' | 'PAID';
```

Por tanto, a nivel de tipos, `createOrderDto.status` solo puede ser:

- `undefined` (es opcional)
- `'PENDING'`
- `'PAID'`

No existe `'COMPLETED'` en ese contrato. Es una decisión de negocio: las órdenes manuales solo se crean como Apartado (PENDING) o Pagado (PAID).

---

## 3. Por qué TypeScript marca TS2367

- El compilador hace **type narrowing**: infiere que `status` es `'PENDING' | 'PAID' | undefined`.
- La expresión `createOrderDto.status === 'COMPLETED'` compara un tipo que **nunca** incluye `'COMPLETED'`.
- Eso se considera un error de diseño (comparación imposible), no solo un “warning”.
- La regla se llama “comparison appears to be unintentional” porque suele indicar:
  - código copiado de otro sitio donde sí existía `COMPLETED`, o
  - un estado que se quitó del DTO pero se dejó en el servicio.

Conclusión: el error es **correcto** desde el punto de vista del sistema de tipos; el bug está en el código que compara con `'COMPLETED'`.

---

## 4. Corrección aplicada

**Antes (incorrecto):**

```ts
// 13. Actualizar contador de boletos vendidos (solo si está pagada o completada)
if (createOrderDto.status === 'PAID' || createOrderDto.status === 'COMPLETED') {
```

**Después (correcto):**

```ts
// 13. Actualizar contador de boletos vendidos (solo si está pagada)
if (createOrderDto.status === 'PAID') {
```

Motivos por los que esta corrección es la adecuada:

1. **Respeta el contrato del DTO:** Solo se usan estados que existen en `CreateOrderManualDto`: `PENDING` y `PAID`.
2. **Lógica de negocio:** Para “orden manual”, el único estado que debe contar como vendido y actualizar `raffle.sold` es `PAID`. `COMPLETED` no es un estado que el usuario pueda elegir al crear una orden manual.
3. **Sin efectos secundarios:** No se elimina ningún caso que en la práctica pudiera ocurrir, porque `status === 'COMPLETED'` nunca era posible con este DTO.
4. **Consistencia:** En otros puntos del código (p. ej. creación de la orden) ya se usa `createOrderDto.status || 'PENDING'`; no se contempla `COMPLETED` en ese flujo.

Si en el futuro se quisiera que las órdenes manuales también tuvieran estado `COMPLETED`, habría que:

- Añadir `'COMPLETED'` al `@IsEnum` en el DTO, y
- Entonces sí tendría sentido volver a incluir `|| createOrderDto.status === 'COMPLETED'` en el `if`.

Mientras el DTO solo permita `PENDING` y `PAID`, la condición debe ser únicamente `status === 'PAID'`.

---

## 5. Verificación

- **Build local:** `npx nest build` en `backend/` termina con éxito (exit code 0).
- **Grep en el backend:** No queda ninguna comparación con `COMPLETED` en el flujo de `createOrderManual` ni en el DTO.
- **Semántica:** El contador `raffle.sold` se incrementa solo cuando la orden manual se crea como Pagada, que es el comportamiento deseado.

---

## 6. Por qué Railway puede seguir mostrando el error

El log que pegaste sigue mostrando la línea con `'COMPLETED'`. Eso indica que Railway está construyendo un **commit anterior** (por ejemplo, un snapshot/cache o un push que no incluye el fix).

**Qué hacer:**

1. Asegurarte de que el cambio está guardado en `backend/src/admin/admin.service.ts` (línea 733 solo con `=== 'PAID'`).
2. Hacer commit y push al repositorio desde el que Railway hace el deploy:
   ```bash
   git add backend/src/admin/admin.service.ts
   git commit -m "fix(admin): remove impossible COMPLETED check in createOrderManual (TS2367)"
   git push origin main
   ```
3. Volver a desplegar en Railway (o dejar que se dispare el deploy automático por el push).

Cuando Railway construya con el código que incluye esta corrección, el error TS2367 desaparecerá y el deploy debería completarse.
