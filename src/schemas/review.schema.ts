import { Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type ReviewDocument = mongoose.HydratedDocument<Review>

export class Review {
    @Prop({ required: true })
    comment: string;
    
    @Prop({ required: true })
    qualification: number;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review)
