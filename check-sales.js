const mongoose = require('mongoose');

const MONGO_URL = 'mongodb://admin:victor2429@ec2-3-129-87-63.us-east-2.compute.amazonaws.com:27017/monterplace?authSource=admin';
const USER_EMAIL = 'administrador@gmail.com';

async function checkSales() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGO_URL);
    console.log('✅ Conectado a MongoDB\n');

    // 1. Buscar el usuario
    console.log('👤 Buscando usuario:', USER_EMAIL);
    const User = mongoose.connection.collection('users');
    const user = await User.findOne({ email: USER_EMAIL });
    
    if (!user) {
      console.log('❌ Usuario no encontrado');
      process.exit(1);
    }
    
    console.log('✅ Usuario encontrado:');
    console.log({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
    console.log('\n');

    const userId = user._id;

    // 2. Buscar ventas en Sales por user_id
    console.log('📦 Buscando ventas en tabla Sales (por user_id)...');
    const Sales = mongoose.connection.collection('sales');
    const salesByUserId = await Sales.find({ user_id: userId }).toArray();
    console.log(`Total ventas en Sales con user_id: ${salesByUserId.length}`);
    
    if (salesByUserId.length > 0) {
      console.log('\n✅ Ventas encontradas en Sales:');
      salesByUserId.forEach((sale, index) => {
        console.log(`\n  Venta ${index + 1}:`);
        console.log(`    _id: ${sale._id}`);
        console.log(`    orderNumber: ${sale.orderNumber}`);
        console.log(`    total: ${sale.total}`);
        console.log(`    status: ${sale.status}`);
        console.log(`    productos: ${sale.products?.length || 0}`);
        console.log(`    createdAt: ${sale.createdAt}`);
      });
    }
    console.log('\n');

    // 3. Buscar relaciones en UserSales
    console.log('🔗 Buscando relaciones en tabla UserSales...');
    const UserSales = mongoose.connection.collection('usersales');
    const userSalesRelations = await UserSales.find({ user_id: userId }).toArray();
    console.log(`Total relaciones en UserSales: ${userSalesRelations.length}`);
    
    if (userSalesRelations.length > 0) {
      console.log('\n✅ Relaciones encontradas:');
      userSalesRelations.forEach((relation, index) => {
        console.log(`\n  Relación ${index + 1}:`);
        console.log(`    _id: ${relation._id}`);
        console.log(`    user_id: ${relation.user_id}`);
        console.log(`    sales_id: ${relation.sales_id}`);
      });
    }
    console.log('\n');

    // 4. Diagnóstico
    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 DIAGNÓSTICO:');
    console.log('═══════════════════════════════════════════════════════\n');

    if (salesByUserId.length > 0 && userSalesRelations.length === 0) {
      console.log('⚠️  PROBLEMA ENCONTRADO:');
      console.log('   El usuario tiene ventas en Sales pero NO tiene relaciones en UserSales');
      console.log('   Por eso la API retorna un array vacío.\n');
      
      console.log('💡 SOLUCIÓN:');
      console.log('   Ejecuta el siguiente código para crear las relaciones:\n');
      console.log('   node fix-sales-relations.js\n');
      
      // Crear archivo de fix
      const fs = require('fs');
      const fixScript = `const mongoose = require('mongoose');

const MONGO_URL = '${MONGO_URL}';
const USER_ID = '${userId}';

async function fixRelations() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGO_URL);
    console.log('✅ Conectado\\n');

    const Sales = mongoose.connection.collection('sales');
    const UserSales = mongoose.connection.collection('usersales');

    // Obtener todas las ventas del usuario
    const sales = await Sales.find({ user_id: new mongoose.Types.ObjectId(USER_ID) }).toArray();
    console.log(\`📦 Encontradas \${sales.length} ventas\\n\`);

    // Crear relaciones
    let created = 0;
    for (const sale of sales) {
      const exists = await UserSales.findOne({ 
        user_id: new mongoose.Types.ObjectId(USER_ID), 
        sales_id: sale._id 
      });
      
      if (!exists) {
        await UserSales.insertOne({
          user_id: new mongoose.Types.ObjectId(USER_ID),
          sales_id: sale._id,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(\`✅ Creada relación para venta: \${sale.orderNumber}\`);
        created++;
      }
    }

    console.log(\`\\n🎉 Proceso completado: \${created} relaciones creadas\`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixRelations();
`;
      
      fs.writeFileSync('fix-sales-relations.js', fixScript);
      console.log('   ✅ Archivo fix-sales-relations.js creado\n');
      
    } else if (salesByUserId.length === 0) {
      console.log('ℹ️  El usuario NO tiene ventas en la tabla Sales');
      console.log('   Esto es normal si el usuario no ha realizado compras.\n');
      
    } else if (userSalesRelations.length > 0) {
      console.log('✅ Todo está correcto:');
      console.log(`   - Ventas en Sales: ${salesByUserId.length}`);
      console.log(`   - Relaciones en UserSales: ${userSalesRelations.length}`);
      console.log('\n   Si la API sigue retornando vacío, verifica:');
      console.log('   1. Que la API esté desplegada con los últimos cambios');
      console.log('   2. Los logs de la API en AWS\n');
    }

    // 5. Verificar ventas usando el método correcto
    if (userSalesRelations.length > 0) {
      console.log('═══════════════════════════════════════════════════════');
      console.log('🔍 VERIFICACIÓN: Ventas usando el método de la API');
      console.log('═══════════════════════════════════════════════════════\n');
      
      const salesIds = userSalesRelations.map(r => r.sales_id);
      const salesByRelation = await Sales.find({ _id: { $in: salesIds } }).toArray();
      
      console.log(`Total ventas encontradas: ${salesByRelation.length}\n`);
      salesByRelation.forEach((sale, index) => {
        console.log(`Venta ${index + 1}:`);
        console.log(`  Order: ${sale.orderNumber}`);
        console.log(`  Total: $${sale.total}`);
        console.log(`  Status: ${sale.status}`);
        console.log(`  Productos: ${sale.products?.length || 0}`);
        console.log('');
      });
    }

    await mongoose.disconnect();
    console.log('✅ Desconectado de MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkSales();
