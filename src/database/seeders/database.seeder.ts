import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'src/schemas/user.schema';
import { Category } from 'src/schemas/category.schema';
import { Product } from 'src/schemas/product.schema';
import { UserProduct } from 'src/schemas/user_product.schema';
import { Sales } from 'src/schemas/sales.schema';
import { UserSales } from 'src/schemas/user_sales.schema';
import { Kardex } from 'src/schemas/kardex.schema';
import { ProductKardex } from 'src/schemas/product_kardex.schema';

@Injectable()
export class DatabaseSeeder {
  constructor(
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
    @InjectModel(Category.name) private categoryModel: mongoose.Model<Category>,
    @InjectModel(Product.name) private productModel: mongoose.Model<Product>,
    @InjectModel(UserProduct.name)
    private userProductModel: mongoose.Model<UserProduct>,
    @InjectModel(Sales.name) private salesModel: mongoose.Model<Sales>,
    @InjectModel(UserSales.name) private userSalesModel: mongoose.Model<UserSales>,
    @InjectModel(Kardex.name) private kardexModel: mongoose.Model<Kardex>,
    @InjectModel(ProductKardex.name)
    private productKardexModel: mongoose.Model<ProductKardex>,
  ) {}

  async seed() {
    console.log('🌱 Iniciando seeder...');

    // Limpiar base de datos
    await this.clearDatabase();

    // Crear usuarios
    const users = await this.seedUsers();
    console.log(`✅ Usuarios creados: ${users.length}`);

    // Crear categorías
    const categories = await this.seedCategories();
    console.log(`✅ Categorías creadas: ${categories.length}`);

    // Crear productos
    const products = await this.seedProducts(categories);
    console.log(`✅ Productos creados: ${products.length}`);

    // Asociar productos a usuarios
    await this.seedUserProducts(users, products);
    console.log(`✅ Productos asociados a usuarios`);

    // Crear movimientos de kardex
    await this.seedKardex(products);
    console.log(`✅ Movimientos de kardex creados`);

    // Crear ventas
    await this.seedSales(users, products);
    console.log(`✅ Ventas creadas`);

    console.log('🎉 Seeder completado exitosamente!');
  }

  private async clearDatabase() {
    console.log('🗑️  Limpiando base de datos...');
    await this.userModel.deleteMany({});
    await this.categoryModel.deleteMany({});
    await this.productModel.deleteMany({});
    await this.userProductModel.deleteMany({});
    await this.salesModel.deleteMany({});
    await this.userSalesModel.deleteMany({});
    await this.kardexModel.deleteMany({});
    await this.productKardexModel.deleteMany({});
  }

  private async seedUsers() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const usersData = [
      {
        name: 'Admin',
        lastName: 'User',
        idNumber: '123456789',
        typeDocument: 'cc',
        phone: '3001234567',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin',
      },
      {
        name: 'Seller',
        lastName: 'One',
        idNumber: '987654321',
        typeDocument: 'cc',
        phone: '3107654321',
        email: 'seller1@test.com',
        password: hashedPassword,
        role: 'seller',
      },
      {
        name: 'Seller',
        lastName: 'Two',
        idNumber: '456789123',
        typeDocument: 'cc',
        phone: '3209876543',
        email: 'seller2@test.com',
        password: hashedPassword,
        role: 'seller',
      },
      {
        name: 'Customer',
        lastName: 'User',
        idNumber: '789123456',
        typeDocument: 'cc',
        phone: '3306543210',
        email: 'customer@test.com',
        password: hashedPassword,
        role: 'customer',
      },
    ];

    return await this.userModel.insertMany(usersData);
  }

  private async seedCategories() {
    const categoriesData = [
      { name: 'Electrónica', description: 'Dispositivos electrónicos' },
      { name: 'Computadoras', description: 'Laptops y computadoras' },
      { name: 'Accesorios', description: 'Accesorios para computadoras' },
      { name: 'Periféricos', description: 'Mouse, teclados, etc.' },
      { name: 'Audio', description: 'Audífonos y parlantes' },
      { name: 'Redes', description: 'Routers y switches' },
    ];

    return await this.categoryModel.insertMany(categoriesData);
  }

  private async seedProducts(categories: any[]) {
    const productsData = [
      // Electrónica
      {
        name: 'Laptop HP Pavilion',
        description: 'Laptop HP Pavilion 15.6" Intel Core i5',
        image_url: 'https://example.com/laptop-hp.jpg',
        cost: 1800000,
        price: 2500000,
        stock: 15,
        discount: 0,
        status: true,
        category_id: categories[0]._id,
      },
      {
        name: 'Laptop Dell Inspiron',
        description: 'Laptop Dell Inspiron 14" Intel Core i7',
        image_url: 'https://example.com/laptop-dell.jpg',
        cost: 2500000,
        price: 3200000,
        stock: 10,
        discount: 5,
        status: true,
        category_id: categories[0]._id,
      },
      {
        name: 'Tablet Samsung Galaxy',
        description: 'Tablet Samsung Galaxy Tab A8',
        image_url: 'https://example.com/tablet-samsung.jpg',
        cost: 600000,
        price: 800000,
        stock: 25,
        discount: 10,
        status: true,
        category_id: categories[0]._id,
      },

      // Computadoras
      {
        name: 'PC Gamer Ryzen 5',
        description: 'PC Gamer AMD Ryzen 5 con RTX 3060',
        image_url: 'https://example.com/pc-gamer.jpg',
        cost: 3500000,
        price: 4500000,
        stock: 8,
        discount: 0,
        status: true,
        category_id: categories[1]._id,
      },
      {
        name: 'Mac Mini M2',
        description: 'Apple Mac Mini con chip M2',
        image_url: 'https://example.com/mac-mini.jpg',
        cost: 4000000,
        price: 5000000,
        stock: 5,
        discount: 0,
        status: true,
        category_id: categories[1]._id,
      },

      // Accesorios
      {
        name: 'Mouse Logitech MX Master',
        description: 'Mouse inalámbrico Logitech MX Master 3',
        image_url: 'https://example.com/mouse-logitech.jpg',
        cost: 250000,
        price: 350000,
        stock: 45,
        discount: 15,
        status: true,
        category_id: categories[2]._id,
      },
      {
        name: 'Teclado Mecánico Corsair',
        description: 'Teclado mecánico RGB Corsair K70',
        image_url: 'https://example.com/teclado-corsair.jpg',
        cost: 350000,
        price: 450000,
        stock: 30,
        discount: 10,
        status: true,
        category_id: categories[2]._id,
      },
      {
        name: 'Webcam Logitech C920',
        description: 'Webcam Full HD 1080p',
        image_url: 'https://example.com/webcam-logitech.jpg',
        cost: 200000,
        price: 280000,
        stock: 20,
        discount: 5,
        status: true,
        category_id: categories[2]._id,
      },

      // Periféricos
      {
        name: 'Monitor Samsung 27"',
        description: 'Monitor Samsung 27" Full HD',
        image_url: 'https://example.com/monitor-samsung.jpg',
        cost: 600000,
        price: 800000,
        stock: 12,
        discount: 8,
        status: true,
        category_id: categories[3]._id,
      },
      {
        name: 'Monitor LG UltraWide 34"',
        description: 'Monitor LG UltraWide 34" QHD',
        image_url: 'https://example.com/monitor-lg.jpg',
        cost: 1400000,
        price: 1800000,
        stock: 6,
        discount: 12,
        status: true,
        category_id: categories[3]._id,
      },
      {
        name: 'Impresora HP LaserJet',
        description: 'Impresora láser HP LaserJet Pro',
        image_url: 'https://example.com/impresora-hp.jpg',
        cost: 900000,
        price: 1200000,
        stock: 8,
        discount: 0,
        status: true,
        category_id: categories[3]._id,
      },

      // Audio
      {
        name: 'Audífonos Sony WH-1000XM5',
        description: 'Audífonos inalámbricos con cancelación de ruido',
        image_url: 'https://example.com/audifonos-sony.jpg',
        cost: 900000,
        price: 1200000,
        stock: 18,
        discount: 5,
        status: true,
        category_id: categories[4]._id,
      },
      {
        name: 'Parlantes Logitech Z623',
        description: 'Sistema de parlantes 2.1',
        image_url: 'https://example.com/parlantes-logitech.jpg',
        cost: 400000,
        price: 500000,
        stock: 15,
        discount: 0,
        status: true,
        category_id: categories[4]._id,
      },
      {
        name: 'Micrófono Blue Yeti',
        description: 'Micrófono USB profesional',
        image_url: 'https://example.com/microfono-blue.jpg',
        cost: 450000,
        price: 600000,
        stock: 10,
        discount: 15,
        status: true,
        category_id: categories[4]._id,
      },

      // Redes
      {
        name: 'Router TP-Link AX3000',
        description: 'Router WiFi 6 AX3000',
        image_url: 'https://example.com/router-tplink.jpg',
        cost: 250000,
        price: 350000,
        stock: 22,
        discount: 5,
        status: true,
        category_id: categories[5]._id,
      },
      {
        name: 'Switch Cisco 24 puertos',
        description: 'Switch Gigabit 24 puertos',
        image_url: 'https://example.com/switch-cisco.jpg',
        cost: 600000,
        price: 800000,
        stock: 5,
        discount: 0,
        status: true,
        category_id: categories[5]._id,
      },

      // Productos con stock bajo
      {
        name: 'Cable HDMI 2.1',
        description: 'Cable HDMI 2.1 de 2 metros',
        image_url: 'https://example.com/cable-hdmi.jpg',
        cost: 30000,
        price: 50000,
        stock: 8,
        discount: 0,
        status: true,
        category_id: categories[2]._id,
      },
      {
        name: 'Hub USB-C',
        description: 'Hub USB-C 7 en 1',
        image_url: 'https://example.com/hub-usb.jpg',
        cost: 80000,
        price: 120000,
        stock: 3,
        discount: 10,
        status: true,
        category_id: categories[2]._id,
      },

      // Productos sin stock
      {
        name: 'SSD Samsung 1TB',
        description: 'SSD NVMe Samsung 980 Pro 1TB',
        image_url: 'https://example.com/ssd-samsung.jpg',
        cost: 350000,
        price: 450000,
        stock: 0,
        discount: 0,
        status: false,
        category_id: categories[1]._id,
      },
      {
        name: 'RAM Corsair 32GB',
        description: 'Memoria RAM DDR4 32GB 3200MHz',
        image_url: 'https://example.com/ram-corsair.jpg',
        cost: 400000,
        price: 500000,
        stock: 0,
        discount: 0,
        status: false,
        category_id: categories[1]._id,
      },
    ];

    return await this.productModel.insertMany(productsData);
  }

  private async seedUserProducts(users: any[], products: any[]) {
    const userProductsData: any[] = [];

    // Admin tiene todos los productos
    const admin = users.find((u) => u.role === 'admin');
    for (const product of products) {
      userProductsData.push({
        user_id: admin._id,
        product_id: product._id,
      });
    }

    // Seller 1 tiene la mitad de los productos
    const seller1 = users.find((u) => u.email === 'seller1@test.com');
    for (let i = 0; i < Math.floor(products.length / 2); i++) {
      userProductsData.push({
        user_id: seller1._id,
        product_id: products[i]._id,
      });
    }

    // Seller 2 tiene la otra mitad
    const seller2 = users.find((u) => u.email === 'seller2@test.com');
    for (let i = Math.floor(products.length / 2); i < products.length; i++) {
      userProductsData.push({
        user_id: seller2._id,
        product_id: products[i]._id,
      });
    }

    await this.userProductModel.insertMany(userProductsData);
  }

  private async seedKardex(products: any[]) {
    const now = new Date();

    for (const product of products) {
      // Stock inicial
      const initialKardex = await this.kardexModel.create({
        comment: 'Stock inicial',
        quantity: product.stock,
        stock: product.stock,
      });

      await this.productKardexModel.create({
        product_id: product._id,
        kardex_id: initialKardex._id,
      });

      // Simular algunos movimientos aleatorios
      const movements = Math.floor(Math.random() * 5) + 2; // 2-6 movimientos
      let currentStock = product.stock;

      for (let i = 0; i < movements; i++) {
        const daysAgo = Math.floor(Math.random() * 30) + 1;
        const movementDate = new Date(now);
        movementDate.setDate(movementDate.getDate() - daysAgo);

        const isEntry = Math.random() > 0.5;
        const quantity = isEntry
          ? Math.floor(Math.random() * 20) + 5
          : -Math.floor(Math.random() * 10) - 1;

        currentStock += quantity;
        if (currentStock < 0) currentStock = 0;

        const comments = isEntry
          ? ['Compra de mercancía', 'Reposición de stock', 'Devolución de cliente']
          : ['Venta', 'Merma', 'Ajuste de inventario'];

        const kardex = await this.kardexModel.create({
          comment: comments[Math.floor(Math.random() * comments.length)],
          quantity: quantity,
          stock: currentStock,
          createdAt: movementDate,
        });

        await this.productKardexModel.create({
          product_id: product._id,
          kardex_id: kardex._id,
          createdAt: movementDate,
        });
      }
    }
  }

  private async seedSales(users: any[], products: any[]) {
    const sellers = users.filter((u) => u.role === 'seller' || u.role === 'admin');
    const now = new Date();

    for (const seller of sellers) {
      // Crear 10-15 ventas por seller
      const salesCount = Math.floor(Math.random() * 6) + 10;

      for (let i = 0; i < salesCount; i++) {
        const daysAgo = Math.floor(Math.random() * 60) + 1;
        const saleDate = new Date(now);
        saleDate.setDate(saleDate.getDate() - daysAgo);

        // Seleccionar 1-4 productos aleatorios
        const productsCount = Math.floor(Math.random() * 4) + 1;
        const selectedProducts: any[] = [];
        let total = 0;

        for (let j = 0; j < productsCount; j++) {
          const randomProduct = products[Math.floor(Math.random() * products.length)];
          const quantity = Math.floor(Math.random() * 3) + 1;
          const price = randomProduct.price;

          selectedProducts.push({
            product_id: randomProduct._id,
            price: price,
            quantity: quantity,
          });

          total += price * quantity;
        }

        const status = Math.random() > 0.3 ? 'completed' : 'pending';

        const sale = await this.salesModel.create({
          products: selectedProducts,
          total: total,
          status: status,
          createdAt: saleDate,
        });

        await this.userSalesModel.create({
          user_id: seller._id,
          sales_id: sale._id,
          createdAt: saleDate,
        });
      }
    }
  }
}
