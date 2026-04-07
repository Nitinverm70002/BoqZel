import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    generateItinerary(query: string): Promise<any>;
    chat(body: {
        message: string;
        history?: any[];
    }): Promise<string>;
}
