import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Product } from "../../../schemas/product.schema";
import { RegisterDto } from "../dto/register.dto";
import { Pagination } from "src/type/pagination";
import { UpdateDto } from "../dto/update.dto";
import { UserProduct } from "../../../schemas/user_product.schema";

@Injectable()
export class ProductRepository {
    constructor(
        @InjectModel(Product.name) private productModel: mongoose.PaginateModel<Product>,
        @InjectModel(UserProduct.name) private userProductModel: mongoose.PaginateModel<UserProduct>,
    ) {}

    async createProduct(product: RegisterDto, user_id: string) {
        const newProduct = await this.productModel.create(product)
        await this.userProductModel.create({ user_id, product_id: newProduct._id })
        return newProduct
    }

    async getAllProductsByUser(
        user_id: string,
        pagination: Pagination,
        filters?: any
    ) {
        const { page, limit } = pagination;

        const products = await this.userProductModel.paginate(
            { user_id },
            {
              page,
              limit,
              populate: [
                {
                  path: "product_id",
                  model: "Product",
                  populate: {
                    path: "category_id",
                    model: "Category",
                  },
                },
              ],
            },
          );
        return products;
    }

    async getAllProducts(pagination: Pagination) {
        const { page, limit } = pagination;

        const products = await this.productModel.paginate(
          { status: true },
          {
            page,
            limit,
            populate: [
              {
                path: "category_id",
                model: "Category",
              },
            ],
          },
        );

        return products;
    }


    async getProductById(id: string) {
        const product = await this.productModel.findById(id).populate('category_id');
        return product;
    }

    async updateProduct(id: string, product: UpdateDto) {
        const updatedProduct = await this.productModel.findByIdAndUpdate(id, product, { new: true }).populate('category_id');
        return updatedProduct;
    }

    async changeStatus(id: string, status: boolean) {
        const product = await this.productModel.findByIdAndUpdate(id, { status }, { new: true }).populate('category_id');
        return product;
    }
}