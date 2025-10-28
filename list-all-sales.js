const mongoose = require('mongoose');

const MONGO_URL = 'mongodb://admin:victor2429@ec2-3-129-87-63.us-east-2.compute.amazonaws.com:27017/monterplace?authSource=admin';

async function listAllSales() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGO_URL);
    console.log('✅ Conectado a MongoDB\n');

    // Obtener todos los usuarios
    const User = mongoose.connection.collection('users');
    const users = await User.find({}).toArray();
    const userMap = {};
    users.forEach(u => {
      userMap[u._id.toString()] = u;
    });

    // Obtener todas las ventas
    const Sales = mongoose.connection.collection('sales');
    const sales = await Sales.find({}).toArray();
    
    console.log(`📦 Total de ventas en la base de datos: ${sales.length}\n`);
    
    if (sales.length === 0) {
      console.log('⚠️  No hay ventas en la base de datos');
    } else {
      console.log('═══════════════════════════════════════════════════════');
      console.log('VENTAS POR USUARIO:');
      console.log('═══════════════════════════════════════════════════════\n');
      
      sales.forEach((sale, index) => {
        const userId = sale.user_id.toString();
        const user = userMap[userId];
        
        console.log(`${index + 1}. Venta ID: ${sale._id}`);
        console.log(`   Order Number: ${sale.orderNumber}`);
        console.log(`   Total: $${sale.total}`);
        console.log(`   Status: ${sale.status}`);
        console.log(`   Productos: ${sale.products?.length || 0}`);
        console.log(`   User ID: ${userId}`);
        if (user) {
          console.log(`   Usuario: ${user.name} (${user.email}) - Rol: ${user.role}`);
        } else {
          console.log(`   Usuario: NO ENCONTRADO`);
        }
        console.log(`   Fecha: ${sale.createdAt}`);
        console.log('');
      });

      // Resumen por usuario
      console.log('═══════════════════════════════════════════════════════');
      console.log('RESUMEN POR USUARIO:');
      console.log('═══════════════════════════════════════════════════════\n');
      
      const salesByUser = {};
      sales.forEach(sale => {
        const userId = sale.user_id.toString();
        if (!salesByUser[userId]) {
          salesByUser[userId] = [];
        }
        salesByUser[userId].push(sale);
      });

      Object.keys(salesByUser).forEach(userId => {
        const user = userMap[userId];
        const userSales = salesByUser[userId];
        
        if (user) {
          console.log(`👤 ${user.name} (${user.email})`);
          console.log(`   Rol: ${user.role}`);
          console.log(`   ID: ${userId}`);
          console.log(`   Total ventas: ${userSales.length}`);
          console.log(`   Total $: ${userSales.reduce((sum, s) => sum + s.total, 0)}`);
        } else {
          console.log(`👤 Usuario desconocido (ID: ${userId})`);
          console.log(`   Total ventas: ${userSales.length}`);
        }
        console.log('');
      });
    }

    // Verificar UserSales
    console.log('═══════════════════════════════════════════════════════');
    console.log('RELACIONES EN USERSALES:');
    console.log('═══════════════════════════════════════════════════════\n');
    
    const UserSales = mongoose.connection.collection('usersales');
    const userSalesRelations = await UserSales.find({}).toArray();
    
    console.log(`Total relaciones: ${userSalesRelations.length}\n`);
    
    if (userSalesRelations.length === 0) {
      console.log('⚠️  ¡PROBLEMA! La tabla UserSales está VACÍA');
      console.log('   Las ventas existen en Sales pero no hay relaciones en UserSales');
      console.log('   Por eso la API retorna array vacío.\n');
      console.log('💡 SOLUCIÓN: Ejecuta el script de fix para crear las relaciones');
      console.log('   node fix-all-sales-relations.js\n');
    } else {
      userSalesRelations.forEach((relation, index) => {
        const userId = relation.user_id.toString();
        const user = userMap[userId];
        
        console.log(`${index + 1}. Relación ID: ${relation._id}`);
        console.log(`   User ID: ${userId}`);
        if (user) {
          console.log(`   Usuario: ${user.name} (${user.email})`);
        }
        console.log(`   Sales ID: ${relation.sales_id}`);
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

listAllSales();
