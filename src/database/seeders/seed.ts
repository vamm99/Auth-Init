import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { DatabaseSeeder } from './database.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seeder = app.get(DatabaseSeeder);

  try {
    await seeder.seed();
    console.log('✅ Seeder ejecutado exitosamente');
  } catch (error) {
    console.error('❌ Error ejecutando seeder:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
