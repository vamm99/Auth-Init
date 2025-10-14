import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type ProductReviewDocument = mongoose.HydratedDocument<ProductReview>

@Schema({ timestamps: true })
export class ProductReview {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true })
    product_id: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: true })
    review_id: mongoose.Types.ObjectId;  
}

export const ProductReviewSchema = SchemaFactory.createForClass(ProductReview)
