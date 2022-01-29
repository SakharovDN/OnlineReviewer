import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenService } from 'src/services/token.service';

@Injectable()
export class AuthAccessTokenGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.tokenService.VerifyAccessToken(request);
  }
}

@Injectable()
export class AuthRefreshTokenGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.tokenService.VerifyRefreshToken(
      request.cookies.RefreshToken,
      request,
    );
  }
}
