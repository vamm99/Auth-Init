import { Controller } from '@nestjs/common';
import { KardexService } from '../service/kardex.service';

@Controller('kardex')
export class KardexController {
  constructor(private readonly kardexService: KardexService) {}
}
