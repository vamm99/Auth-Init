import { Controller } from '@nestjs/common';
import { SalesService } from '../service/sales.service';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}
}
