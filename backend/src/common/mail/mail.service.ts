import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('MAIL_HOST'),
      port: this.config.get<number>('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.config.get<string>('MAIL_USER'),
        pass: this.config.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendResetPasswordEmail(email: string, resetLink: string) {
    const mailOptions = {
      from: this.config.get<string>('MAIL_FROM'),
      to: email,
      subject: 'Reset Your Password',
      html: this.getResetTemplate(resetLink),
    };

    await this.transporter.sendMail(mailOptions);
  }

  // 🔥 Professional HTML template
  private getResetTemplate(resetLink: string): string {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password.</p>
        <p>Click the button below to reset your password (valid for 5 minutes):</p>
        
        <a href="${resetLink}" 
           style="display:inline-block;padding:10px 20px;
           background:#e11d48;color:white;text-decoration:none;
           border-radius:5px;">
           Reset Password
        </a>

        <p>If you did not request this, please ignore this email.</p>
      </div>
    `;
  }
}