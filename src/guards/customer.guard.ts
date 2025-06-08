import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Roles } from '../enums';

@Injectable()
export class CustomerGuard implements CanActivate {
  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user, params } = ctx.switchToHttp().getRequest();
    if (user.role === Roles.SUPERADMIN || user.role === Roles.ADMIN) {
      return true;
    }
    if (user.role === Roles.CUSTOMER && user.id === Number(params.id)) {
      return true;
    }
    throw new ForbiddenException(`Forbidden user with role ${user.role}`);
  }
}
