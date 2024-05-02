import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload';
import { AuthService } from '../auth.service';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private authService:AuthService,
  ) {}


  async canActivate( context: ExecutionContext ): Promise<boolean>{
     //  Toda la info de la solicitud (url, cabeceras..)
    const request = context.switchToHttp().getRequest();
    // Extraemos el token (sin validarlo todavía)
    const token = this.extractTokenFromHeader(request);

     // Si no hay token
    if (!token) {
      throw new UnauthorizedException('There is no bearer token');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token, { secret: process.env.JWT_SEED }
      );
        
      const user = await this.authService.findUserById( payload.id );
      if ( !user ) throw new UnauthorizedException('User does not exists');
      if ( !user.isActive ) throw new UnauthorizedException('User is not active');
      
      // Si todo sale bien, colocamos el usuario en la request
      request['user'] = user;
      
    } catch (error) {
      throw new UnauthorizedException();
    }
   

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}