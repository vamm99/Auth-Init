import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Resend } from "resend";

export interface EmailProps {
    from: string;
    to: string;
    replyTo: string;
    subject: string;
    text: string;
    html?: string;
}

@Injectable()
export class EmailService {
    private readonly resend: Resend;
    constructor(private readonly configService: ConfigService) {
        this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
    }

    async sendEmail( data: EmailProps ) {
        try {
            const response = await this.resend.emails.send({
                from: data.from,
                to: data.to,
                replyTo: data.replyTo,
                subject: data.subject,
                text: data.text,
                html: data.html,
            })
            return response
        } catch (error) {
            throw error
        }
    }
}
