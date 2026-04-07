import { MoveService } from './move.service';
export declare class MoveController {
    private readonly moveService;
    constructor(moveService: MoveService);
    getVehicles(query: string): Promise<{
        id: string;
        name: string;
        type: string;
        image: string;
        currency: string;
        location: string;
        verified: boolean;
        createdAt: Date;
        updatedAt: Date;
        pricePerDay: number;
        seats: number;
        transmission: string;
        fuelType: string;
        driverOption: boolean;
    }[]>;
}
