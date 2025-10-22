import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ReviewService } from '../service/review.service';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { User } from 'src/modules/auth/decorators/user.decorator';
import { ProfileDto } from 'src/modules/auth/dto/profile.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('product/:productId')
  @Roles('admin', 'seller', 'customer')
  async createReview(
    @Param('productId') productId: string,
    @Body() body: { comment: string; qualification: number },
    @User() user: ProfileDto
  ) {
    return this.reviewService.createReview(productId, user._id, body.comment, body.qualification);
  }

  @Public()
  @Get('product/:productId')
  async getProductReviews(@Param('productId') productId: string) {
    return this.reviewService.getProductReviews(productId);
  }
}
