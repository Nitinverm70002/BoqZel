import { StaysService, Stay } from './stays.service';
export declare class StaysController {
    private readonly staysService;
    constructor(staysService: StaysService);
    findAll(type?: string, query?: string, sort?: string): Promise<Stay[]>;
    findOne(id: string): Promise<Stay | null>;
}
