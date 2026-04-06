import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { Vehicle } from '@prisma/client';
export declare class MoveService {
    private prisma;
    private aiService;
    private readonly logger;
    constructor(prisma: PrismaService, aiService: AiService);
    findAll(location?: string): Promise<Vehicle[]>;
    fetchRealCars(city: string): Promise<any[]>;
}
