import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type ReviewDocument = mongoose.HydratedDocument<Review>

@Schema({ timestamps: true })
export class Review {
    @Prop({ required: true })
    comment: string;
    
    @Prop({ required: true })
    qualification: number;
}

export const ReviewSchema = SchemaFactory.createForClass(Review)
