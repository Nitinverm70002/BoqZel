import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any, res: any): Promise<void>;
    facebookAuth(req: any): Promise<void>;
    facebookAuthRedirect(req: any, res: any): Promise<void>;
}
