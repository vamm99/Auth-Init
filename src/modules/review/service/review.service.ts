import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from 'src/schemas/review.schema';
import { ProductReview, ProductReviewDocument } from 'src/schemas/product_review.schema';
import { UserReview, UserReviewDocument } from 'src/schemas/user_review.schema';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(ProductReview.name) private productReviewModel: Model<ProductReviewDocument>,
    @InjectModel(UserReview.name) private userReviewModel: Model<UserReviewDocument>,
  ) {}

  async createReview(productId: string, userId: string, comment: string, qualification: number) {
    // Crear la review
    const review = await this.reviewModel.create({
      comment,
      qualification,
    });

    // Crear la relación producto-review
    await this.productReviewModel.create({
      product_id: productId,
      review_id: review._id,
    });

    // Crear la relación usuario-review
    await this.userReviewModel.create({
      user_id: userId,
      review_id: review._id,
    });

    return {
      code: 201,
      message: 'Review created successfully',
      data: review,
    };
  }

  async getProductReviews(productId: string) {
    const productReviews = await this.productReviewModel
      .find({ product_id: productId })
      .populate('review_id')
      .exec();

    const reviewsWithUsers = await Promise.all(
      productReviews.map(async (pr: any) => {
        const userReview = await this.userReviewModel
          .findOne({ review_id: pr.review_id._id })
          .populate('user_id', 'name lastName')
          .exec();

        return {
          ...pr.review_id.toObject(),
          user: userReview ? (userReview as any).user_id : null,
        };
      })
    );

    return {
      code: 200,
      message: 'Reviews fetched successfully',
      data: reviewsWithUsers,
    };
  }
}
