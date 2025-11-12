import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
@Injectable()
export class AuthMiddleware implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token= this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('Token de autorizacao ausente');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {secret: process.env.jwtSecret});
            request['user'] = payload;
            return true;
        }
        catch (error) {
            throw new UnauthorizedException('Token de autorizacao invalido');
        }
    }
    private extractTokenFromHeader(request: Request): string | null {
        const [type, token] = request.headers['authorization']?.split(' ')?? [];
        return type === 'Bearer' ? token : null;
}
}