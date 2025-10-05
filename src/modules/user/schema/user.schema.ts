import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type UserDocument = HydratedDocument<User>

export enum UserRole {
    ADMIN = 'admin',
    SELLER = 'seller',
    CUSTOMER = 'customer',
}

@Schema()
export class User {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, enum: UserRole, default: UserRole.CUSTOMER })
    role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User)

