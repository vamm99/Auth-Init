import { Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type ProductReviewDocument = mongoose.HydratedDocument<ProductReview>

export class ProductReview {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true })
    product_id: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: true })
    review_id: mongoose.Types.ObjectId;  
    
    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const ProductReviewSchema = SchemaFactory.createForClass(ProductReview)
