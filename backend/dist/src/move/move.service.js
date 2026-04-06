"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MoveService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ai_service_1 = require("../ai/ai.service");
let MoveService = MoveService_1 = class MoveService {
    prisma;
    aiService;
    logger = new common_1.Logger(MoveService_1.name);
    constructor(prisma, aiService) {
        this.prisma = prisma;
        this.aiService = aiService;
    }
    async findAll(location) {
        const where = {};
        if (location) {
            where.location = { contains: location, mode: 'insensitive' };
        }
        let results = [];
        try {
            results = await this.prisma.vehicle.findMany({
                where,
            });
        }
        catch (error) {
            this.logger.error(`Database connection failed in findAll: ${error.message}`);
        }
        if (results.length === 0 && location && location.trim().length > 2) {
            this.logger.log(`Fetching real Booking API car locations for: ${location}`);
            let newVehicles = await this.fetchRealCars(location);
            if (!newVehicles || newVehicles.length === 0) {
                this.logger.log(`Booking API returned empty for ${location}. Falling back to AI Generation...`);
                newVehicles = await this.aiService.generateVehicles(location);
            }
            if (newVehicles && newVehicles.length > 0) {
                const safeImages = {
                    suv: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80',
                    van: 'https://images.unsplash.com/photo-1510168341108-16e6d19afcc9?auto=format&fit=crop&q=80',
                    truck: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80',
                    luxury: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0b12?auto=format&fit=crop&q=80',
                    sedan: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80'
                };
                for (const v of newVehicles) {
                    try {
                        const vType = (v.type || 'suv').toLowerCase();
                        let finalImage = v.image;
                        if (!finalImage || finalImage.includes('unsplash.com')) {
                            finalImage = safeImages[vType] || safeImages.suv;
                        }
                        results.push(v);
                        try {
                            await this.prisma.vehicle.create({
                                data: {
                                    name: v.name,
                                    type: vType,
                                    image: finalImage,
                                    pricePerDay: Number(v.pricePerDay) || 150,
                                    currency: v.currency || 'USD',
                                    location: v.location || location,
                                    seats: Number(v.seats) || 5,
                                    transmission: v.transmission || 'Automatic',
                                    fuelType: v.fuelType || 'Petrol',
                                    driverOption: v.driverOption !== undefined ? Boolean(v.driverOption) : true,
                                    verified: true,
                                }
                            });
                        }
                        catch (error) {
                            this.logger.error(`Error saving vehicle: ${error.message}`);
                        }
                    }
                    catch (error) {
                        this.logger.error(`Error saving vehicle: ${error.message}`);
                    }
                }
            }
        }
        return results;
    }
    async fetchRealCars(city) {
        const apiKey = process.env.RAPIDAPI_KEY;
        if (!apiKey) {
            this.logger.warn('RAPIDAPI_KEY missing, skipping real car search.');
            return [];
        }
        try {
            const locRes = await fetch(`https://booking-com.p.rapidapi.com/v1/car-rental/locations?name=${encodeURIComponent(city)}&locale=en-gb`, {
                headers: {
                    'x-rapidapi-host': 'booking-com.p.rapidapi.com',
                    'x-rapidapi-key': apiKey
                }
            });
            const locData = await locRes.json();
            if (!locData || locData.length === 0) {
                this.logger.warn(`No location found in Booking API for: ${city}`);
                return [];
            }
            const pickupData = locData[0];
            const lat = pickupData.latitude || pickupData.dest_latitude || pickupData.lat;
            const lng = pickupData.longitude || pickupData.dest_longitude || pickupData.lng;
            const realLocationName = pickupData.name || city;
            if (!lat || !lng)
                return [];
            const today = new Date();
            const pickupDate = new Date(today);
            pickupDate.setDate(today.getDate() + 14);
            const dropoffDate = new Date(today);
            dropoffDate.setDate(today.getDate() + 17);
            const fmtP = pickupDate.toISOString().split('T')[0] + ' 10:00:00';
            const fmtD = dropoffDate.toISOString().split('T')[0] + ' 10:00:00';
            this.logger.log(`Searching Booking API Cars for coords: ${lat}, ${lng} on ${fmtP}`);
            const searchUrl = `https://booking-com.p.rapidapi.com/v1/car-rental/search?pick_up_latitude=${lat}&pick_up_longitude=${lng}&drop_off_latitude=${lat}&drop_off_longitude=${lng}&pick_up_datetime=${encodeURIComponent(fmtP)}&drop_off_datetime=${encodeURIComponent(fmtD)}&locale=en-gb&currency=USD&sort_by=recommended&from_country=nl`;
            const searchRes = await fetch(searchUrl, {
                headers: {
                    'x-rapidapi-host': 'booking-com.p.rapidapi.com',
                    'x-rapidapi-key': apiKey
                }
            });
            const searchData = await searchRes.json();
            const results = searchData?.search_results || [];
            if (results.length === 0)
                return [];
            return results.slice(0, 10).map((item) => {
                const vehicle = item.vehicle_info || {};
                const price = item.pricing_info?.price || item.pricing?.price || 150;
                const name = vehicle.v_name || vehicle.name || 'Premium Rental Car';
                let image = vehicle.image_url || vehicle.v_image_url;
                if (!image || !image.startsWith('http')) {
                    const typeStr = (vehicle.v_type || vehicle.type || 'car').toLowerCase();
                    if (typeStr.includes('suv'))
                        image = 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80';
                    else if (typeStr.includes('van'))
                        image = 'https://images.unsplash.com/photo-1510168341108-16e6d19afcc9?auto=format&fit=crop&q=80';
                    else
                        image = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80';
                }
                return {
                    name: name,
                    type: (vehicle.v_type || vehicle.type || 'sedan').toLowerCase(),
                    image: image,
                    pricePerDay: Math.floor(Number(price) / 3),
                    currency: 'USD',
                    location: realLocationName,
                    seats: vehicle.seats || vehicle.v_seats || 5,
                    transmission: vehicle.transmission === 'M' || vehicle.v_transmission === 'Manual' ? 'Manual' : 'Automatic',
                    fuelType: vehicle.fuel_type || vehicle.v_fuel_type || 'Petrol',
                    driverOption: false,
                };
            });
        }
        catch (error) {
            this.logger.error(`Error with real car API logic: ${error.message}`);
            return [];
        }
    }
};
exports.MoveService = MoveService;
exports.MoveService = MoveService = MoveService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, ai_service_1.AiService])
], MoveService);
//# sourceMappingURL=move.service.js.map