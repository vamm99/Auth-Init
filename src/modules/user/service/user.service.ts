import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiResponse } from 'src/type/type';
import { User } from 'src/schemas/user.schema';
import { BcryptService } from 'src/modules/auth/service/bcrypt.service';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly bcryptService: BcryptService,
    ) {}

    /**
     * Crear un nuevo usuario
     */
    async create(userData: CreateUserDto): Promise<ApiResponse<User>> {
        // Verificar si el usuario ya existe
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new ConflictException('El usuario con este email ya existe');
        }

        // Hashear la contraseña
        const hashedPassword = await this.bcryptService.hashPassword(userData.password);
        userData.password = hashedPassword;

        // Crear el usuario
        const newUser = await this.userRepository.create(userData);

        // Remover la contraseña de la respuesta
        const userObject = (newUser as any).toObject ? (newUser as any).toObject() : newUser;
        const { password, ...userWithoutPassword } = userObject;

        return {
            code: 201,
            message: 'Usuario creado exitosamente',
            data: userWithoutPassword as User,
        };
    }

    /**
     * Obtener todos los usuarios con paginación y filtros
     */
    async findAll(
        page: number = 1,
        limit: number = 10,
        filters: any = {}
    ): Promise<ApiResponse<User[]>> {
        const result = await this.userRepository.findAll(page, limit, filters);

        return {
            code: 200,
            message: 'Usuarios obtenidos exitosamente',
            data: result.docs,
            meta: {
                page: result.page,
                limit: result.limit,
                total: result.totalDocs,
                totalPages: result.totalPages,
            },
        };
    }

    /**
     * Obtener un usuario por ID
     */
    async findById(id: string): Promise<ApiResponse<User>> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        return {
            code: 200,
            message: 'Usuario obtenido exitosamente',
            data: user,
        };
    }

    /**
     * Actualizar un usuario
     */
    async update(id: string, userData: UpdateUserDto): Promise<ApiResponse<User>> {
        // Verificar si el usuario existe
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new NotFoundException('Usuario no encontrado');
        }

        // Si se actualiza el email, verificar que no exista otro usuario con ese email
        if (userData.email && userData.email !== existingUser.email) {
            const userWithEmail = await this.userRepository.findByEmail(userData.email);
            if (userWithEmail) {
                throw new ConflictException('Ya existe un usuario con este email');
            }
        }

        // Si se actualiza la contraseña, hashearla
        if (userData.password) {
            userData.password = await this.bcryptService.hashPassword(userData.password);
        }

        // Actualizar el usuario
        const updatedUser = await this.userRepository.update(id, userData);

        return {
            code: 200,
            message: 'Usuario actualizado exitosamente',
            data: updatedUser!,
        };
    }

    /**
     * Eliminar un usuario (soft delete)
     */
    async softDelete(id: string): Promise<ApiResponse<User>> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        const deletedUser = await this.userRepository.softDelete(id);

        return {
            code: 200,
            message: 'Usuario desactivado exitosamente',
            data: deletedUser!,
        };
    }

    /**
     * Eliminar un usuario permanentemente
     */
    async delete(id: string): Promise<ApiResponse<void>> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        await this.userRepository.delete(id);

        return {
            code: 200,
            message: 'Usuario eliminado permanentemente',
        };
    }

    /**
     * Obtener estadísticas de usuarios
     */
    async getStats(): Promise<ApiResponse<any>> {
        const stats = await this.userRepository.getStats();

        return {
            code: 200,
            message: 'Estadísticas obtenidas exitosamente',
            data: stats,
        };
    }
}
