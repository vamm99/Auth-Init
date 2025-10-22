# Fix: Problema de Stock Duplicado

## 🔴 Problema Identificado

El stock se estaba descontando **DOS VECES** durante el proceso de compra:

1. **Primera vez**: En `payment.service.ts` al crear el pago (líneas 29-56)
2. **Segunda vez**: En `sales.service.ts` al crear la venta (líneas 83-88)

Esto causaba que cuando un usuario agregaba todos los productos disponibles al carrito y completaba la compra, el backend arrojaba un error de "stock insuficiente" porque el stock ya había sido descontado en el paso del pago.

## ✅ Solución Implementada

### 1. **Modificado `payment.service.ts`**

**Antes:**
- ✅ Verificaba stock
- ❌ **Descontaba stock** 
- ❌ Creaba registros en Kardex
- ❌ Creaba relaciones Product-Kardex
- ✅ Creaba el pago

**Después:**
- ✅ Verifica stock (sin descontar)
- ✅ Valida que los productos existen
- ✅ Crea el pago
- ✅ Crea la relación usuario-pago

**Cambios:**
- Eliminadas líneas 42-56: descuento de stock y creación de kardex
- El pago ahora solo valida disponibilidad sin modificar inventario

### 2. **Actualizado `sales.service.ts`**

**Ahora maneja:**
- ✅ Validación de stock
- ✅ Creación de la venta
- ✅ **Descuento de stock** (una sola vez)
- ✅ **Creación de registros en Kardex**
- ✅ **Creación de relaciones Product-Kardex**

**Cambios:**
- Agregadas dependencias: `Kardex` y `ProductKardex` models
- Actualizado `updateProductStock()` para crear registros de kardex
- El método ahora registra: stock anterior, cantidad vendida, y stock nuevo

### 3. **Actualizado `sales.module.ts`**

**Agregados schemas:**
```typescript
{ name: Kardex.name, schema: KardexSchema },
{ name: ProductKardex.name, schema: ProductKardexSchema }
```

## 📊 Flujo Correcto Ahora

```
Usuario completa checkout
    ↓
1. POST /payment
   - Verifica que productos existen
   - Verifica que hay stock disponible
   - Crea registro de pago
   - NO modifica stock
    ↓
2. POST /sales
   - Valida stock nuevamente
   - Crea la venta
   - Descuenta stock (UNA SOLA VEZ)
   - Crea registros en Kardex
   - Crea relaciones Product-Kardex
    ↓
✅ Compra completada exitosamente
```

## 🧪 Para Probar

1. Reinicia el servidor backend:
   ```bash
   npm run start:dev
   ```

2. En el frontend, agrega productos al carrito con la cantidad exacta disponible

3. Completa el proceso de checkout

4. Verifica que:
   - ✅ La compra se completa sin errores
   - ✅ El stock se descuenta correctamente
   - ✅ Se crean los registros en Kardex
   - ✅ La orden aparece en "Mis Órdenes"

## 📝 Archivos Modificados

- `/src/modules/payment/service/payment.service.ts`
- `/src/modules/sales/service/sales.service.ts`
- `/src/modules/sales/sales.module.ts`

## 🎯 Resultado

El problema del stock duplicado está resuelto. Ahora el inventario se descuenta una sola vez cuando se crea la venta, y se mantiene el registro histórico en el Kardex.
