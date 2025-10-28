const mongoose = require('mongoose');

const MONGO_URL = 'mongodb://admin:victor2429@ec2-3-129-87-63.us-east-2.compute.amazonaws.com:27017/monterplace?authSource=admin';

async function listUsers() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGO_URL);
    console.log('✅ Conectado a MongoDB\n');

    const User = mongoose.connection.collection('users');
    const users = await User.find({}).toArray();
    
    console.log(`📋 Total de usuarios en la base de datos: ${users.length}\n`);
    
    if (users.length === 0) {
      console.log('⚠️  No hay usuarios en la base de datos');
    } else {
      console.log('Usuarios encontrados:\n');
      users.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}`);
        console.log(`   Nombre: ${user.name || 'N/A'}`);
        console.log(`   Rol: ${user.role || 'N/A'}`);
        console.log(`   ID: ${user._id}`);
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

listUsers();
