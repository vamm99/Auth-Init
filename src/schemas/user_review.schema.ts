import { Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type UserReviewDocument = mongoose.HydratedDocument<UserReview>

export class UserReview {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user_id: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: true })
    review_id: mongoose.Types.ObjectId;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const UserReviewSchema = SchemaFactory.createForClass(UserReview)
