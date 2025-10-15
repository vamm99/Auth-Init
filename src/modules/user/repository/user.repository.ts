import { User } from "../../../schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model, PaginateModel } from "mongoose";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";

export class UserRepository {

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User> & PaginateModel<User>,
    ) {}

    /**
     * Crear un nuevo usuario
     */
    async create(userData: CreateUserDto): Promise<User> {
        const newUser = new this.userModel(userData);
        return await newUser.save();
    }

    /**
     * Obtener todos los usuarios con paginación y filtros
     */
    async findAll(page: number = 1, limit: number = 10, filters: any = {}): Promise<any> {
        const query: any = {};

        // Filtro por búsqueda (nombre, email, idNumber)
        if (filters.search) {
            query.$or = [
                { name: { $regex: filters.search, $options: 'i' } },
                { lastName: { $regex: filters.search, $options: 'i' } },
                { email: { $regex: filters.search, $options: 'i' } },
                { idNumber: { $regex: filters.search, $options: 'i' } },
            ];
        }

        // Filtro por rol
        if (filters.role) {
            query.role = filters.role;
        }

        // Filtro por estado
        if (filters.status !== undefined) {
            query.status = filters.status === 'true';
        }

        const options = {
            page,
            limit,
            sort: { createdAt: -1 },
            select: '-password', // No retornar contraseña
        };

        return await this.userModel.paginate(query, options);
    }

    /**
     * Obtener un usuario por ID
     */
    async findById(id: string): Promise<User | null> {
        return await this.userModel.findById(id).select('-password').exec();
    }

    /**
     * Obtener un usuario por email
     */
    async findByEmail(email: string): Promise<User | null> {
        return await this.userModel.findOne({ email }).exec();
    }

    /**
     * Actualizar un usuario
     */
    async update(id: string, userData: UpdateUserDto): Promise<User | null> {
        return await this.userModel
            .findByIdAndUpdate(id, { ...userData, updatedAt: new Date() }, { new: true })
            .select('-password')
            .exec();
    }

    /**
     * Eliminar un usuario (soft delete - cambiar status a false)
     */
    async softDelete(id: string): Promise<User | null> {
        return await this.userModel
            .findByIdAndUpdate(id, { status: false, updatedAt: new Date() }, { new: true })
            .select('-password')
            .exec();
    }

    /**
     * Eliminar un usuario permanentemente
     */
    async delete(id: string): Promise<User | null> {
        return await this.userModel.findByIdAndDelete(id).exec();
    }

    /**
     * Contar usuarios por rol
     */
    async countByRole(): Promise<any> {
        return await this.userModel.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]);
    }

    /**
     * Obtener estadísticas de usuarios
     */
    async getStats(): Promise<any> {
        const total = await this.userModel.countDocuments();
        const active = await this.userModel.countDocuments({ status: true });
        const inactive = await this.userModel.countDocuments({ status: false });
        const byRole = await this.countByRole();

        return {
            total,
            active,
            inactive,
            byRole
        };
    }
}