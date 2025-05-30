import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}
  async sendOtp(email: string, otp: string) {
    await this.mailService.sendMail({
      to: email,
      subject: `Welcome to Online Marketplace`,
      text: otp,
    });
  }
}
