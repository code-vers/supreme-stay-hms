import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private config;
    private transporter;
    constructor(config: ConfigService);
    sendResetPasswordEmail(email: string, resetLink: string): Promise<void>;
    private getResetTemplate;
}
