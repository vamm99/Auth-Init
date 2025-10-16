import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/schemas/user.schema";
import { RegisterDto } from "../dto/register.dto";


export class AuthRepository {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ){}

    async register(user: RegisterDto) {
        try {
            const newUser = await this.userModel.create(user)
            return newUser
        } catch (error) {
            throw error
        }
    }

    async getUserByEmail(email: string){
        try {
            const user = await this.userModel.findOne({ email })
            return user
        } catch (error) {
            throw error
        }
    }

    async getUserById(id: string){
        try {
            const user = await this.userModel.findById(id)
            return user
        } catch (error) {
            throw error
        }
    }

    async updatePassword(email: string, password: string){
        try {
            const updatedUser = await this.userModel.findOneAndUpdate({ email }, { password }, { new: true })
            return updatedUser
        } catch (error) {
            throw error
        }
    }

    async updateUser(id: string, userData: any){
        try {
            const updatedUser = await this.userModel.findByIdAndUpdate(id, userData, { new: true })
            return updatedUser
        } catch (error) {
            throw error
        }
    }
}