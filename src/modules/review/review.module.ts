import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewService } from './service/review.service';
import { ReviewController } from './controller/review.controller';
import { Review, ReviewSchema } from 'src/schemas/review.schema';
import { ProductReview, ProductReviewSchema } from 'src/schemas/product_review.schema';
import { UserReview, UserReviewSchema } from 'src/schemas/user_review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: ProductReview.name, schema: ProductReviewSchema },
      { name: UserReview.name, schema: UserReviewSchema },
    ]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
