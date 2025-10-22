import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

export type SalesDocument = mongoose.HydratedDocument<Sales>;

export enum SalesStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    PROCESSING = 'processing',
    FAILED = 'failed'
}

@Schema({ timestamps: true })
export class Sales {
    @Prop({ type: Date })
    createdAt: Date;

    @Prop({ type: Date })
    updatedAt: Date;
    
    @Prop({ 
        type: [{
            product_id: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Product',
                required: true 
            },
            name: {
                type: String,
                required: true
            },
            price: { 
                type: Number, 
                required: true,
                min: 0
            },
            quantity: { 
                type: Number, 
                required: true,
                min: 1 
            },
            image_url: {
                type: String,
                default: ''
            }
        }],
        required: true,
        _id: false
    })
    products: Array<{ 
        product_id: mongoose.Types.ObjectId;
        name: string;
        price: number;
        quantity: number;
        image_url?: string;
    }>;

    @Prop({ 
        type: Number, 
        required: true,
        min: 0 
    })
    total: number;

    @Prop({ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    })
    user_id: mongoose.Types.ObjectId;

    @Prop({ 
        type: String,
        required: false
    })
    payment_id?: string;

    @Prop({ 
        enum: SalesStatus, 
        default: SalesStatus.PENDING 
    })
    status: SalesStatus;

    @Prop({ 
        type: String, 
        unique: true 
    })
    orderNumber: string;
}

// Apply pagination plugin to the schema
const SalesSchema = SchemaFactory.createForClass(Sales);
SalesSchema.plugin(mongoosePaginate);

export { SalesSchema };

// Add pre-save hook to generate order number
SalesSchema.pre<Sales>('save', async function(next) {
    if (!this.orderNumber) {
        // Generate a unique order number
        this.orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    next();
});

