import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import config from 'src/config';
import { catchError } from 'src/utils/catch-error';

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
        throw new UnauthorizedException('Unauthorizated');
      }
      const bearer = auth.split(' ')[0];
      const token = auth.split(' ')[1];
      if (bearer != 'Bearer' || !token) {
        throw new UnauthorizedException('Token not found');
      }
      const user = this.jwtService.verify(token, {
        secret: config.ACCESS_TOKEN_KEY,
      });
      if (!user) {
        throw new UnauthorizedException('Token expired');
      }
      req.user = user;
      return true;
    } catch (error) {
      return catchError(error);
    }
  }
}
