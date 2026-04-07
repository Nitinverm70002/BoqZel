import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private configService;
    private readonly logger;
    private groq;
    constructor(configService: ConfigService);
    generateItinerary(query: string): Promise<any>;
    chat(message: string, history?: any[]): Promise<string>;
    generateStays(location: string): Promise<any[]>;
    generateVehicles(location: string): Promise<any[]>;
}
