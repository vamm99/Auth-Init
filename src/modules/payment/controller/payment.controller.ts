import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PaymentService } from '../service/payment.service';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { User } from 'src/modules/auth/decorators/user.decorator';
import { ProfileDto } from 'src/modules/auth/dto/profile.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @Roles('admin', 'seller', 'buyer', 'customer')
  async createPayment(
    @Body() body: {
      products: Array<{ product_id: string; price: number; quantity: number }>;
      total: number;
      payment_method: string;
    },
    @User() user: ProfileDto
  ) {
    console.log('📥 POST /payment recibido');
    console.log('Body:', body);
    console.log('User:', user);
    
    // Convertir el método de pago a mayúsculas para que coincida con el enum
    const paymentMethod = body.payment_method.toUpperCase() as any;
    const result = await this.paymentService.createPayment(body.products, body.total, paymentMethod, user._id);
    
    console.log('📤 Respuesta enviada:', result);
    return result;
  }

  @Get('user')
  @Roles('admin', 'seller', 'buyer', 'customer')
  async getUserPayments(@User() user: ProfileDto) {
    return this.paymentService.getUserPayments(user._id);
  }

  @Get(':id')
  @Roles('admin', 'seller', 'buyer', 'customer')
  async getPaymentById(@Param('id') id: string) {
    return this.paymentService.getPaymentById(id);
  }
}
