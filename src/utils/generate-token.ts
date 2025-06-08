import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { catchError } from './error-catch';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken = async (payload: object) => {
    return this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: process.env.ACCESS_TOKEN_TIME,
    });
  };

  generateRefreshToken = async (payload: object) => {
    return this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: process.env.REFRESH_TOKEN_TIME,
    });
  };

  verifyAccessToken = (accessToken: string) => {
    try {
      return this.jwtService.decode(accessToken);
    } catch (e) {
      return catchError(e);
    }
  };

  verifyRefreshToken = (refreshToken: string) => {
    try {
      return this.jwtService.decode(refreshToken);
    } catch (e) {
      return catchError(e);
    }
  };
}
