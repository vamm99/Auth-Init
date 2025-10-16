import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query 
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { QueryUserDto } from '../dto/query-user.dto';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';

@Controller('user')
@Roles('admin', 'seller') // Solo admin puede gestionar usuarios
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Crear un nuevo usuario
   * POST /user
   */
  @Post()
  async create(@Body() userData: CreateUserDto) {
    return await this.userService.create(userData);
  }

  /**
   * Obtener todos los usuarios con paginación y filtros
   * GET /user?page=1&limit=10&search=john&role=admin&status=true
   */
  @Get()
  async findAll(@Query() query: QueryUserDto) {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const filters = {
      search: query.search,
      role: query.role,
      status: query.status,
    };

    return await this.userService.findAll(page, limit, filters);
  }

  /**
   * Obtener estadísticas de usuarios
   * GET /user/stats
   */
  @Get('stats')
  async getStats() {
    return await this.userService.getStats();
  }

  /**
   * Obtener un usuario por ID
   * GET /user/:id
   */
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.userService.findById(id);
  }

  /**
   * Actualizar un usuario
   * PUT /user/:id
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() userData: UpdateUserDto
  ) {
    return await this.userService.update(id, userData);
  }

  /**
   * Desactivar un usuario (soft delete)
   * DELETE /user/:id/soft
   */
  @Delete(':id/soft')
  async softDelete(@Param('id') id: string) {
    return await this.userService.softDelete(id);
  }

  /**
   * Eliminar un usuario permanentemente
   * DELETE /user/:id
   */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.userService.delete(id);
  }
}
