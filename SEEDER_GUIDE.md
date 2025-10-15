# 🌱 Seeder de Base de Datos - Guía Completa

## ✅ Seeder Implementado

He creado un **seeder completo** que llena la base de datos con datos de prueba para todos los módulos del sistema.

---

## 🎯 Datos Generados

### **1. Usuarios (4 usuarios)** 👥

| Email | Password | Rol | Nombre |
|-------|----------|-----|--------|
| admin@test.com | password123 | admin | Admin User |
| seller1@test.com | password123 | seller | Seller One |
| seller2@test.com | password123 | seller | Seller Two |
| customer@test.com | password123 | customer | Customer User |

---

### **2. Categorías (6 categorías)** 📁

1. **Electrónica** - Dispositivos electrónicos
2. **Computadoras** - Laptops y computadoras
3. **Accesorios** - Accesorios para computadoras
4. **Periféricos** - Mouse, teclados, etc.
5. **Audio** - Audífonos y parlantes
6. **Redes** - Routers y switches

---

### **3. Productos (20 productos)** 📦

#### **Electrónica**
- Laptop HP Pavilion - $2,500,000 (Stock: 15)
- Laptop Dell Inspiron - $3,200,000 (Stock: 10)
- Tablet Samsung Galaxy - $800,000 (Stock: 25)

#### **Computadoras**
- PC Gamer Ryzen 5 - $4,500,000 (Stock: 8)
- Mac Mini M2 - $5,000,000 (Stock: 5)

#### **Accesorios**
- Mouse Logitech MX Master - $350,000 (Stock: 45)
- Teclado Mecánico Corsair - $450,000 (Stock: 30)
- Webcam Logitech C920 - $280,000 (Stock: 20)
- Cable HDMI 2.1 - $50,000 (Stock: 8) ⚠️ Stock Bajo
- Hub USB-C - $120,000 (Stock: 3) ⚠️ Stock Bajo

#### **Periféricos**
- Monitor Samsung 27" - $800,000 (Stock: 12)
- Monitor LG UltraWide 34" - $1,800,000 (Stock: 6)
- Impresora HP LaserJet - $1,200,000 (Stock: 8)

#### **Audio**
- Audífonos Sony WH-1000XM5 - $1,200,000 (Stock: 18)
- Parlantes Logitech Z623 - $500,000 (Stock: 15)
- Micrófono Blue Yeti - $600,000 (Stock: 10)

#### **Redes**
- Router TP-Link AX3000 - $350,000 (Stock: 22)
- Switch Cisco 24 puertos - $800,000 (Stock: 5)

#### **Sin Stock** ❌
- SSD Samsung 1TB - $450,000 (Stock: 0)
- RAM Corsair 32GB - $500,000 (Stock: 0)

---

### **4. Asociación de Productos a Usuarios** 🔗

- **Admin**: Tiene TODOS los productos (20)
- **Seller 1**: Tiene la primera mitad (10 productos)
- **Seller 2**: Tiene la segunda mitad (10 productos)

---

### **5. Movimientos de Kardex** 📊

Para cada producto:
- **1 movimiento inicial**: Stock inicial
- **2-6 movimientos aleatorios**: Compras, ventas, devoluciones, etc.
- **Fechas**: Últimos 30 días
- **Tipos de movimientos**:
  - ✅ **Entradas (+)**: Compra de mercancía, Reposición de stock, Devolución de cliente
  - ❌ **Salidas (-)**: Venta, Merma, Ajuste de inventario

**Total aproximado**: ~80-120 movimientos de kardex

---

### **6. Ventas** 💰

Para cada seller (Admin, Seller 1, Seller 2):
- **10-15 ventas** por usuario
- **1-4 productos** por venta
- **Estado**: 70% completadas, 30% pendientes
- **Fechas**: Últimos 60 días
- **Total aproximado**: 30-45 ventas en el sistema

---

## 📁 Archivos Creados

```
✅ src/database/seeders/database.seeder.ts  - Lógica del seeder
✅ src/database/seeders/seeder.module.ts    - Módulo del seeder
✅ src/database/seeders/seed.ts             - Script de ejecución
✅ src/app.module.ts                        - Actualizado con SeederModule
✅ package.json                             - Script "seed" agregado
```

---

## 🚀 Cómo Ejecutar el Seeder

### **Opción 1: Comando NPM (Recomendado)**

```bash
cd /home/victor/NestJs/Auth-Init
npm run seed
```

### **Opción 2: Directamente con ts-node**

```bash
cd /home/victor/NestJs/Auth-Init
ts-node -r tsconfig-paths/register src/database/seeders/seed.ts
```

---

## 📋 Proceso del Seeder

El seeder ejecuta los siguientes pasos en orden:

```
1. 🗑️  Limpiar base de datos (eliminar todos los datos)
   ↓
2. 👥 Crear usuarios (4 usuarios)
   ↓
3. 📁 Crear categorías (6 categorías)
   ↓
4. 📦 Crear productos (20 productos)
   ↓
5. 🔗 Asociar productos a usuarios
   ↓
6. 📊 Crear movimientos de kardex (~100 movimientos)
   ↓
7. 💰 Crear ventas (~35 ventas)
   ↓
8. ✅ Seeder completado
```

---

## 🔍 Verificar Datos

### **1. Iniciar Sesión**

Puedes iniciar sesión con cualquiera de estos usuarios:

```bash
# Admin
Email: admin@test.com
Password: password123

# Seller 1
Email: seller1@test.com
Password: password123

# Seller 2
Email: seller2@test.com
Password: password123
```

### **2. Verificar en el Frontend**

```bash
cd /home/victor/NextJs/administrador
npm run dev
```

Luego ve a:
- `/home` - Ver dashboard con métricas
- `/products` - Ver productos
- `/categories` - Ver categorías
- `/sales` - Ver ventas
- `/inventory` - Ver inventario y movimientos

### **3. Verificar en MongoDB**

Si tienes MongoDB Compass o similar:

```javascript
// Contar documentos
db.users.countDocuments()        // 4
db.categories.countDocuments()   // 6
db.products.countDocuments()     // 20
db.sales.countDocuments()        // ~35
db.kardexes.countDocuments()     // ~100
```

---

## 📊 Datos Estadísticos Esperados

### **Dashboard (Home)**
- Total de Ventas: ~10-15 (por usuario)
- Ingresos Totales: ~$15,000,000 - $30,000,000
- Ventas Completadas: ~7-10
- Ventas Pendientes: ~3-5

### **Inventario**
- Total Productos: 10-20 (según usuario)
- Stock Total: ~200-300 unidades
- Stock Bajo: 2-3 productos
- Sin Stock: 0-2 productos

### **Ventas**
- Ventas por página: 10
- Rango de fechas: Últimos 60 días
- Estados: Completadas y Pendientes

---

## ⚠️ Notas Importantes

### **1. Limpieza de Datos**
El seeder **elimina TODOS los datos** antes de insertar los nuevos. Úsalo solo en desarrollo.

### **2. Datos Aleatorios**
Algunos datos son generados aleatoriamente:
- Cantidad de movimientos de kardex (2-6 por producto)
- Cantidad de ventas (10-15 por seller)
- Productos en cada venta (1-4)
- Fechas de movimientos (últimos 30-60 días)

### **3. Contraseñas**
Todas las contraseñas son: `password123`

### **4. Relaciones**
El seeder crea correctamente todas las relaciones:
- UserProduct (usuario ↔ producto)
- UserSales (usuario ↔ venta)
- ProductKardex (producto ↔ kardex)

---

## 🧪 Casos de Prueba

### **Test 1: Login y Dashboard**
```
1. Login con admin@test.com
2. Ve a /home
3. Verás métricas de ventas
4. Verás acciones rápidas
```

### **Test 2: Productos**
```
1. Ve a /products
2. Verás 20 productos
3. Filtra por categoría
4. Edita un producto
```

### **Test 3: Inventario**
```
1. Ve a /inventory
2. Verás productos con stock
3. Click en "Ver Movimientos"
4. Verás historial de kardex
```

### **Test 4: Ventas**
```
1. Ve a /sales
2. Verás ventas de los últimos 60 días
3. Filtra por estado
4. Exporta a Excel
```

### **Test 5: Exportar Inventario**
```
1. Ve a /inventory
2. Selecciona rango de fechas
3. Click en "Exportar Excel"
4. Verás 2 hojas: Inventario y Kardex
```

---

## 🔄 Re-ejecutar el Seeder

Si necesitas volver a llenar la base de datos:

```bash
npm run seed
```

Esto:
1. Eliminará todos los datos actuales
2. Creará nuevos datos de prueba
3. Generará nuevas fechas aleatorias

---

## 🎯 Propósito del Seeder

### **Para Desarrollo**
- ✅ Probar funcionalidades sin crear datos manualmente
- ✅ Verificar que todos los módulos funcionen
- ✅ Testear filtros, paginación, exportación
- ✅ Demostrar el sistema completo

### **Para Demos**
- ✅ Mostrar el sistema con datos realistas
- ✅ Presentar todas las funcionalidades
- ✅ Datos variados (stock alto, bajo, sin stock)

---

## 📝 Estructura de Datos

### **Ejemplo de Venta Generada**

```json
{
  "products": [
    {
      "product_id": "...",
      "price": 2500000,
      "quantity": 2
    },
    {
      "product_id": "...",
      "price": 350000,
      "quantity": 1
    }
  ],
  "total": 5350000,
  "status": "completed",
  "createdAt": "2024-12-15T10:30:00.000Z"
}
```

### **Ejemplo de Movimiento de Kardex**

```json
{
  "comment": "Compra de mercancía",
  "quantity": 50,
  "stock": 150,
  "createdAt": "2024-12-10T09:00:00.000Z"
}
```

---

## 🎉 Resumen

**¡Seeder completo y funcional!**

- ✅ **4 usuarios** (admin, 2 sellers, 1 customer)
- ✅ **6 categorías** de productos
- ✅ **20 productos** con precios y stock variado
- ✅ **~100 movimientos** de kardex
- ✅ **~35 ventas** distribuidas en 60 días
- ✅ **Relaciones completas** entre todas las entidades
- ✅ **Datos realistas** para probar el sistema

**Ejecuta `npm run seed` y tendrás una base de datos completa para probar!** 🚀
