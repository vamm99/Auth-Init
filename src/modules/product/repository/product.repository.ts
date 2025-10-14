import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product } from "../../../schemas/product.schema";
import { RegisterDto } from "../dto/register.dto";

@Injectable()
export class ProductRepository {
    constructor(
        @InjectModel(Product.name) private productModel: Model<Product>,
    ) {}

    async createProduct(product: RegisterDto) {
        const newProduct = await this.productModel.create(product)
        return newProduct
    }
}