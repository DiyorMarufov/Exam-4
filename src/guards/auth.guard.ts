import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Status } from '../enums/index';
import { catchError } from '../utils/error-catch';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const auth = req.headers?.authorization;
      if (!auth) {
        throw new UnauthorizedException('Unauthorized');
      }

      const [bearer, token] = auth.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException('Token not found');
      }
      const user = this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
      if (!user) {
        throw new UnauthorizedException('Token expired');
      }
      if (user?.status === Status.INACTIVE) {
        throw new BadRequestException('User is inactive');
      }
      req.user = user;
      return true;
    } catch (error) {
      return catchError(error);
    }
  }
}
