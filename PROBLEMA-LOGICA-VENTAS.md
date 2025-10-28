# 🚨 PROBLEMA CRÍTICO: Lógica de Ventas Incorrecta

## ❌ Problema Actual

El código actual asocia las ventas al **CUSTOMER** (comprador), pero según la lógica de negocio de un marketplace, las ventas deben asociarse al **SELLER/ADMIN** (vendedor).

### Flujo Actual (INCORRECTO):
```
Customer compra → Se crea Sale con user_id = customer_id
```

### Flujo Correcto (DEBE SER):
```
Customer compra → Buscar dueño del producto → Se crea Sale con user_id = seller_id
```

---

## 📊 Estructura de Datos

### Tablas involucradas:

1. **`users`** - Usuarios (customer, seller, admin)
2. **`products`** - Productos
3. **`user_product`** - Relaciona productos con sus vendedores
   ```
   user_id (seller/admin) ↔ product_id
   ```
4. **`sales`** - Ventas (debe tener user_id del SELLER)
5. **`user_sales`** - Relaciona vendedores con sus ventas
   ```
   user_id (seller/admin) ↔ sales_id
   ```

---

## 🔧 Solución Requerida

### Cambios en `createSale`:

```typescript
async createSale(
  products: ProductSaleInput[],
  total: number,
  payment_id: string,
  buyer_id: string  // ← ID del customer que compra
): Promise<ApiResponse<SalesResponse>> {
  
  // 1. Agrupar productos por vendedor
  const productsBySeller = await this.groupProductsBySeller(products);
  
  // 2. Crear una venta por cada vendedor
  const sales = [];
  for (const [sellerId, sellerProducts] of Object.entries(productsBySeller)) {
    const sellerTotal = sellerProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    
    const saleData: CreateSaleDto = {
      products: sellerProducts,
      total: sellerTotal,
      payment_id,
      status: SalesStatus.PENDING,
      user_id: sellerId  // ← ID del SELLER, no del customer
    };
    
    const sale = await this.salesRepository.createSale(saleData, sellerId);
    sales.push(sale);
  }
  
  // 3. Opcionalmente: Crear registro de compra para el customer
  // (si quieres trackear las compras del customer)
  
  return sales;
}

// Nuevo método helper
private async groupProductsBySeller(products: ProductSaleInput[]) {
  const UserProduct = this.userProductModel;
  const grouped = {};
  
  for (const product of products) {
    // Buscar el dueño del producto
    const userProduct = await UserProduct.findOne({ product_id: product.product_id });
    
    if (!userProduct) {
      throw new Error(`Producto ${product.product_id} no tiene vendedor asignado`);
    }
    
    const sellerId = userProduct.user_id.toString();
    
    if (!grouped[sellerId]) {
      grouped[sellerId] = [];
    }
    
    grouped[sellerId].push(product);
  }
  
  return grouped;
}
```

---

## 📋 Cambios Necesarios

### 1. Modificar `sales.service.ts`:
- [ ] Agregar inyección de `UserProduct` model
- [ ] Crear método `groupProductsBySeller()`
- [ ] Modificar `createSale()` para agrupar por vendedor
- [ ] Crear una venta por cada vendedor
- [ ] Actualizar stock correctamente

### 2. Modificar `sales.repository.ts`:
- [ ] El método `createSale` ya está bien (recibe sellerId)
- [ ] Asegurar que `UserSales` se cree con el sellerId

### 3. Opcional: Crear tabla de Compras (Purchases):
Si quieres trackear las compras del customer:
- [ ] Crear esquema `Purchase`
- [ ] Crear tabla `user_purchases` (customer_id ↔ purchase_id)
- [ ] Guardar la compra del customer

---

## 🎯 Resultado Esperado

### Ejemplo:
```
Customer "Juan" compra:
- Producto A (vendedor: Admin)
- Producto B (vendedor: Seller1)
- Producto C (vendedor: Admin)

Se crean:
✅ Venta 1: Admin (Productos A + C)
✅ Venta 2: Seller1 (Producto B)

En la tabla Sales:
- Sale 1: user_id = admin_id, products = [A, C]
- Sale 2: user_id = seller1_id, products = [B]

En la tabla UserSales:
- { user_id: admin_id, sales_id: sale1_id }
- { user_id: seller1_id, sales_id: sale2_id }
```

---

## ⚠️ Impacto

Este es un cambio **CRÍTICO** en la lógica de negocio que afecta:
- ✅ Creación de ventas
- ✅ Consulta de ventas por vendedor
- ✅ Estadísticas de ventas
- ✅ Reportes de ventas
- ✅ Comisiones/pagos a vendedores

---

## 🚀 Plan de Implementación

### Opción A: Fix Completo (Recomendado)
1. Implementar la nueva lógica en `createSale`
2. Migrar datos existentes (re-asociar ventas a vendedores)
3. Probar exhaustivamente
4. Desplegar

### Opción B: Fix Rápido (Temporal)
1. Crear script para re-asociar ventas existentes a vendedores
2. Mantener código actual pero corregir datos
3. Planear refactor completo después

---

## 📞 Decisión Requerida

¿Qué opción prefieres?

**Opción A**: Implemento la lógica correcta ahora (tomará más tiempo pero será correcto)

**Opción B**: Creo un script para corregir las ventas existentes y mantenemos el código actual (rápido pero no ideal)

**Opción C**: Explicación de cómo debe funcionar y tú decides cuándo implementarlo
