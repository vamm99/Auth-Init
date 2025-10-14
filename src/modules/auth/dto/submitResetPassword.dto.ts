import { IsEmail } from "class-validator";

export class SubmitResetPasswordDto {
    @IsEmail()
    email: string;
}
