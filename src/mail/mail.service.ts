import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}
  async sendOtp(email: string, text: string, otp: string) {
    await this.mailService.sendMail({
      to: email,
      subject: text,
      text: otp,
    });
  }
}
