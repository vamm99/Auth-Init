import { ConflictException, InternalServerErrorException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../repository/auth.repository';
import { RegisterDto } from '../dto/register.dto';
import { BcryptService } from './bcrypt.service';
import { ApiResponse } from 'src/type/type';
import { LoginDto } from '../dto/login.dto';
import { PayloadDto } from '../dto/payload.dto';
import { JwtService } from '@nestjs/jwt';
import { ResetPasswordDto } from '../dto/resetPassword.dto';
import { NodemailerService, EmailProps} from 'src/util/email/nodemailer.service';
import { ConfigService } from '@nestjs/config';
import { WelcomeTemplate } from 'src/util/template/welcome.templete';
import { UpdatePasswordTemplate } from 'src/util/template/updatePassword.template';
import { SellerWelcomeTemplate } from 'src/util/template/sellerWelcome.template';

@Injectable()
export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository, 
        private readonly bcryptService: BcryptService, 
        private readonly jwtService: JwtService,
        private readonly nodemailerService: NodemailerService,
        private readonly configService: ConfigService,
    ){}

    async register(user: RegisterDto): Promise<ApiResponse<RegisterDto>>{
        const existingUser = await this.authRepository.getUserByEmail(user.email)
        if (existingUser) {
            throw new ConflictException('User already exists')
        }

        const hashedPassword = await this.bcryptService.hashPassword(user.password)
        user.password = hashedPassword

        const newUser = await this.authRepository.register(user)
        if (!newUser) {
            throw new InternalServerErrorException('User registration failed')
        }

        const emailData: EmailProps = {
            from: this.configService.get<string>('NODEMAILER_USER')!,
            to: user.email,
            subject: 'Welcome to our app',
            html: WelcomeTemplate(user.name),
        }

        await this.nodemailerService.sendEmail(emailData)

        return {
            code: 201,
            message: 'User registered successfully',
            data: newUser
        }
    }

    async login(user: LoginDto): Promise<ApiResponse<LoginDto>>{
        const existingUser = await this.authRepository.getUserByEmail(user.email)
        if (!existingUser) {
            throw new NotFoundException('User not found')
        }

        const isPasswordMatch = await this.bcryptService.comparePassword(user.password, existingUser.password)
        if (!isPasswordMatch) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const payload:PayloadDto = {
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role
        }

        const token = this.jwtService.sign(payload)

        return {
            code: 200,
            message: 'User logged in successfully',
            token,
            data: existingUser
        }
    }

    async submitResetPasswordLink(email: string): Promise<ApiResponse<string>>{
        const existingUser = await this.authRepository.getUserByEmail(email)
        if (!existingUser) {
            throw new NotFoundException('User not found')
        }

        const payload:PayloadDto = {
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role
        }

        const token = this.jwtService.sign(payload)

        //TODO: Change this to production URL
        const link = `http://localhost:3000/reset-password?token=${token}`

        const emailData: EmailProps = {
            from: 'onboarding@resend.dev',
            to: existingUser.email,
            subject: 'Reset Password',
            html: UpdatePasswordTemplate({name: existingUser.name, link}),
        }

        await this.nodemailerService.sendEmail(emailData)

        return {
            code: 200,
            message: 'Email sent successfully'
        }
    }

    async updatePassword(data: ResetPasswordDto, userId: string): Promise<ApiResponse<ResetPasswordDto>>{
        const existingUser = await this.authRepository.getUserById(userId)
        if (!existingUser) {
            throw new NotFoundException('User not found')
        }

        const hashedPassword = await this.bcryptService.hashPassword(data.password)

        const updatedUser = await this.authRepository.updatePassword(existingUser.email, hashedPassword)
        if (!updatedUser) {
            throw new InternalServerErrorException('User update failed')
        }

        return {
            code: 200,
            message: 'Password updated successfully',
            data: updatedUser
        }
    }

    async updateProfile(userId: string, profileData: any): Promise<ApiResponse<any>>{
        const existingUser = await this.authRepository.getUserById(userId)
        if (!existingUser) {
            throw new NotFoundException('User not found')
        }

        const updatedUser = await this.authRepository.updateUser(userId, profileData)
        if (!updatedUser) {
            throw new InternalServerErrorException('Profile update failed')
        }

        return {
            code: 200,
            message: 'Profile updated successfully',
            data: updatedUser
        }
    }

    async registerSeller(user: RegisterDto): Promise<ApiResponse<RegisterDto>>{
        const existingUser = await this.authRepository.getUserByEmail(user.email)
        if (existingUser) {
            throw new ConflictException('User already exists')
        }

        const hashedPassword = await this.bcryptService.hashPassword(user.password)
        user.password = hashedPassword
        user.role = 'seller'

        const newUser = await this.authRepository.register(user)
        if (!newUser) {
            throw new InternalServerErrorException('User registration failed')
        }

        const adminLink = 'https://moterplace-sim9.vercel.app/login'

        const emailData: EmailProps = {
            from: this.configService.get<string>('NODEMAILER_USER')!,
            to: user.email,
            subject: 'Bienvenido a MonterPlace - Acceso de Vendedor',
            html: SellerWelcomeTemplate(user.name, adminLink),
        }

        await this.nodemailerService.sendEmail(emailData)

        return {
            code: 201,
            message: 'Seller registered successfully. Please check your email to access the admin panel.',
            data: newUser
        }
    }
}
