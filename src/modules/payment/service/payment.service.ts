import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument, PaymentMethod, PaymentStatus } from 'src/schemas/payment.schema';
import { UserPayment, UserPaymentDocument } from 'src/schemas/user_payment.schema';
import { Product, ProductDocument } from 'src/schemas/product.schema';
import { Kardex, KardexDocument } from 'src/schemas/kardex.schema';
import { ProductKardex, ProductKardexDocument } from 'src/schemas/product_kardex.schema';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(UserPayment.name) private userPaymentModel: Model<UserPaymentDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Kardex.name) private kardexModel: Model<KardexDocument>,
    @InjectModel(ProductKardex.name) private productKardexModel: Model<ProductKardexDocument>,
  ) {}

  async createPayment(
    products: Array<{ product_id: string; price: number; quantity: number }>,
    total: number,
    payment_method: PaymentMethod,
    user_id: string
  ) {
    console.log('🛒 Iniciando creación de pago:', { products, total, payment_method, user_id });
    
    // 1. Verificar stock y actualizar inventario
    for (const item of products) {
      console.log(`📦 Verificando producto: ${item.product_id}`);
      const product = await this.productModel.findById(item.product_id);
      
      if (!product) {
        throw new Error(`Producto ${item.product_id} no encontrado`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para ${product.name}. Disponible: ${product.stock}, Solicitado: ${item.quantity}`);
      }

      // Actualizar stock del producto
      const newStock = product.stock - item.quantity;
      await this.productModel.findByIdAndUpdate(item.product_id, { stock: newStock });

      // 2. Crear registro en Kardex
      const kardex = await this.kardexModel.create({
        comment: `Venta - Pago procesado`,
        quantity: item.quantity,
        stock: newStock,
      });

      // 3. Crear relación Product-Kardex
      await this.productKardexModel.create({
        product_id: item.product_id,
        kardex_id: kardex._id,
      });
    }

    // 4. Crear el pago
    console.log('💳 Creando registro de pago...');
    const payment = await this.paymentModel.create({
      products,
      total,
      payment_method,
      status: PaymentStatus.COMPLETED,
    });
    console.log('✅ Pago creado:', payment._id);

    // 5. Crear la relación usuario-pago
    console.log('🔗 Creando relación usuario-pago...');
    await this.userPaymentModel.create({
      user_id,
      payment_id: payment._id,
    });
    console.log('✅ Relación usuario-pago creada');

    console.log('🎉 Pago completado exitosamente');
    return {
      code: 201,
      message: 'Payment created successfully',
      data: payment,
    };
  }

  async getUserPayments(user_id: string) {
    const userPayments = await this.userPaymentModel
      .find({ user_id })
      .populate('payment_id')
      .sort({ createdAt: -1 })
      .exec();

    const payments = userPayments.map((up: any) => up.payment_id);

    return {
      code: 200,
      message: 'Payments fetched successfully',
      data: payments,
    };
  }

  async getPaymentById(id: string) {
    const payment = await this.paymentModel.findById(id).exec();

    return {
      code: 200,
      message: 'Payment fetched successfully',
      data: payment,
    };
  }
}
