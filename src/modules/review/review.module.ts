import { Module } from '@nestjs/common';
import { ReviewService } from './service/review.service';
import { ReviewController } from './controller/review.controller';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
