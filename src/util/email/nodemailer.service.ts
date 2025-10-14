import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Transporter } from "nodemailer";
import * as nodemailer from 'nodemailer';

export interface EmailProps {
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

@Injectable()
export class NodemailerService {
    private readonly transporter: Transporter;
    
    constructor(
        private readonly configService: ConfigService
    ){
        this.transporter = nodemailer.createTransport({
            service: this.configService.get<string>('NODEMAILER_SERVICE'),
            auth: {
                user: this.configService.get<string>('NODEMAILER_USER'),
                pass: this.configService.get<string>('NODEMAILER_PASS'),
            },
        });
    }

    async sendEmail(data: EmailProps){
        try {
            const mailOptions = {
                from: data.from,
                to: data.to,
                subject: data.subject,
                text: data.text,
                html: data.html,
            };
            const response = await this.transporter.sendMail(mailOptions);
            return response;
        } catch (error) {
            throw error;
        }
    }
}
