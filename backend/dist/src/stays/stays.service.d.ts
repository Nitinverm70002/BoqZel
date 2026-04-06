import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
export interface Stay {
    id: string;
    name: string;
    type: string;
    image: string;
    rating: number;
    reviewCount: number;
    pricePerNight: number;
    currency: string;
    location: string;
    amenities: string[];
    verified: boolean;
    description: string;
}
export declare class StaysService {
    private prisma;
    private aiService;
    private readonly logger;
    constructor(prisma: PrismaService, aiService: AiService);
    findAll(type?: string, query?: string, sortBy?: string): Promise<Stay[]>;
    fetchRealHotels(city: string): Promise<any[]>;
    findOne(id: string): Promise<Stay | null>;
    seed(mockData: Stay[]): Promise<void>;
}
