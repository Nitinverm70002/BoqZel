import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateOAuthUser(profile: any): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        provider: string;
        email: string;
        providerId: string;
        avatar: string | null;
    }>;
    login(user: any): Promise<{
        access_token: string;
        user: any;
    }>;
}
