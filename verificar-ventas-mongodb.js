// Script para verificar ventas en MongoDB
// Ejecutar en MongoDB Compass o mongo shell

// 1. OBTENER EL USUARIO LOGUEADO
// Reemplaza con el email del usuario que está intentando ver las ventas
const userEmail = "tu-email@ejemplo.com";

const user = db.users.findOne({ email: userEmail });
console.log("👤 Usuario encontrado:");
console.log({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
});

const userId = user._id;

// 2. VERIFICAR VENTAS EN LA TABLA SALES
console.log("\n📦 Ventas en tabla Sales con user_id:");
const salesByUserId = db.sales.find({ user_id: userId }).toArray();
console.log(`Total: ${salesByUserId.length}`);
salesByUserId.forEach(sale => {
  console.log({
    _id: sale._id,
    orderNumber: sale.orderNumber,
    total: sale.total,
    status: sale.status,
    user_id: sale.user_id,
    createdAt: sale.createdAt
  });
});

// 3. VERIFICAR RELACIONES EN LA TABLA USERSALES
console.log("\n🔗 Relaciones en tabla UserSales:");
const userSalesRelations = db.usersales.find({ user_id: userId }).toArray();
console.log(`Total relaciones: ${userSalesRelations.length}`);
userSalesRelations.forEach(relation => {
  console.log({
    _id: relation._id,
    user_id: relation.user_id,
    sales_id: relation.sales_id,
    createdAt: relation.createdAt
  });
});

// 4. VERIFICAR SI LAS VENTAS TIENEN RELACIÓN
if (userSalesRelations.length === 0 && salesByUserId.length > 0) {
  console.log("\n⚠️ PROBLEMA ENCONTRADO:");
  console.log("El usuario tiene ventas en la tabla Sales pero NO tiene relaciones en UserSales");
  console.log("Esto explica por qué no se muestran las ventas.");
  console.log("\n💡 SOLUCIÓN: Crear las relaciones faltantes");
  console.log("Ejecuta el siguiente código para crear las relaciones:");
  console.log("\n// CÓDIGO PARA CREAR RELACIONES:");
  salesByUserId.forEach(sale => {
    console.log(`db.usersales.insertOne({ user_id: ObjectId("${userId}"), sales_id: ObjectId("${sale._id}"), createdAt: new Date(), updatedAt: new Date() });`);
  });
}

// 5. OBTENER LAS VENTAS USANDO EL MÉTODO CORRECTO (como lo hace la API)
console.log("\n✅ Ventas usando el método correcto (a través de UserSales):");
const salesIds = userSalesRelations.map(us => us.sales_id);
if (salesIds.length > 0) {
  const salesByRelation = db.sales.find({ _id: { $in: salesIds } }).toArray();
  console.log(`Total: ${salesByRelation.length}`);
  salesByRelation.forEach(sale => {
    console.log({
      _id: sale._id,
      orderNumber: sale.orderNumber,
      total: sale.total,
      status: sale.status,
      products: sale.products.length + " productos"
    });
  });
} else {
  console.log("No hay ventas (porque no hay relaciones en UserSales)");
}

// 6. VERIFICAR TODAS LAS VENTAS EN LA BASE DE DATOS
console.log("\n📊 RESUMEN GENERAL:");
console.log("Total ventas en Sales:", db.sales.countDocuments());
console.log("Total relaciones en UserSales:", db.usersales.countDocuments());
console.log("Ventas del usuario en Sales:", salesByUserId.length);
console.log("Relaciones del usuario en UserSales:", userSalesRelations.length);
