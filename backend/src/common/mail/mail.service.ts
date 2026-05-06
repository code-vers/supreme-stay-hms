import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    const host =
      this.config.get<string>('EMAIL_HOST') ??
      this.config.get<string>('MAIL_HOST');
    const port = Number(
      this.config.get<string>('EMAIL_PORT') ??
        this.config.get<string>('MAIL_PORT') ??
        587,
    );
    const user =
      this.config.get<string>('EMAIL_USER') ??
      this.config.get<string>('MAIL_USER');
    const pass =
      this.config.get<string>('EMAIL_PASSWORD') ??
      this.config.get<string>('MAIL_PASS');

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
      auth: {
        user,
        pass,
      },
    });
  }

  async sendResetPasswordEmail(email: string, resetLink: string) {
    const mailOptions = {
      from:
        this.config.get<string>('EMAIL_FROM') ??
        this.config.get<string>('MAIL_FROM'),
      to: email,
      subject: 'Reset Your Password',
      html: this.getResetTemplate(resetLink),
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendMail(to: string | string[], subject: string, html: string) {
    const mailOptions = {
      from:
        this.config.get<string>('EMAIL_FROM') ??
        this.config.get<string>('MAIL_FROM'),
      to,
      subject,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }

  // Professional HTML template
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
