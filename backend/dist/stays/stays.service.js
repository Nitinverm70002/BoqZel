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
var StaysService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaysService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ai_service_1 = require("../ai/ai.service");
let StaysService = StaysService_1 = class StaysService {
    prisma;
    aiService;
    logger = new common_1.Logger(StaysService_1.name);
    constructor(prisma, aiService) {
        this.prisma = prisma;
        this.aiService = aiService;
    }
    async findAll(type, query, sortBy = 'rating') {
        const where = {};
        if (type && type !== 'All') {
            let normalizedType = type.toLowerCase();
            if (normalizedType.endsWith('s')) {
                normalizedType = normalizedType.slice(0, -1);
            }
            where.type = normalizedType;
        }
        if (query && query.trim().length > 0) {
            where.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { location: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
            ];
        }
        let orderBy = { rating: 'desc' };
        if (sortBy === 'priceLow')
            orderBy = { pricePerNight: 'asc' };
        if (sortBy === 'priceHigh')
            orderBy = { pricePerNight: 'desc' };
        if (sortBy === 'rating')
            orderBy = { rating: 'desc' };
        let results = [];
        try {
            results = await this.prisma.stay.findMany({
                where,
                orderBy,
            });
        }
        catch (error) {
            this.logger.error(`Database connection failed in findAll: ${error.message}`);
        }
        console.log(`Checking API condition: results.length=${results.length}, query=${query}`);
        if (results.length === 0 && query && query.trim().length > 2) {
            this.logger.log(`Triggering Real API generation for unmapped location: ${query}`);
            console.log(`Triggering Real API generation for unmapped location: ${query}`);
            const newStays = await this.fetchRealHotels(query);
            console.log(`API returned newStays length: ${newStays?.length}`);
            if (newStays && newStays.length > 0) {
                for (const generatedStay of newStays) {
                    results.push(generatedStay);
                    try {
                        console.log(`Saving real stay: ${generatedStay.name}`);
                        await this.prisma.stay.create({
                            data: {
                                name: generatedStay.name,
                                type: generatedStay.type,
                                image: generatedStay.image,
                                rating: Number(generatedStay.rating) || 4.8,
                                reviewCount: Number(generatedStay.reviewCount) || 100,
                                pricePerNight: Number(generatedStay.pricePerNight) || 200,
                                currency: generatedStay.currency || 'USD',
                                location: generatedStay.location || query,
                                amenities: generatedStay.amenities || [],
                                verified: true,
                                description: generatedStay.description || '',
                            }
                        });
                    }
                    catch (error) {
                        this.logger.error(`Failed to save Real API stay: ${error.message}`);
                    }
                }
            }
        }
        console.log(`Returning results length: ${results.length}`);
        return results;
    }
    async fetchRealHotels(city) {
        const apiKey = process.env.RAPIDAPI_KEY;
        if (!apiKey) {
            this.logger.warn('RAPIDAPI_KEY missing, skipping real hotel search.');
            return [];
        }
        try {
            this.logger.log(`Fetching destination ID for ${city}`);
            const locRes = await fetch(`https://booking-com.p.rapidapi.com/v1/hotels/locations?name=${encodeURIComponent(city)}&locale=en-gb`, {
                headers: {
                    'x-rapidapi-host': 'booking-com.p.rapidapi.com',
                    'x-rapidapi-key': apiKey
                }
            });
            const locData = await locRes.json();
            if (!locData || locData.length === 0 || !locData[0].dest_id) {
                this.logger.warn(`No destination ID found for ${city}`);
                return [];
            }
            const destId = locData[0].dest_id;
            const destType = locData[0].dest_type || 'city';
            const checkinDate = new Date();
            checkinDate.setDate(checkinDate.getDate() + 14);
            const checkinStr = checkinDate.toISOString().split('T')[0];
            const checkoutDate = new Date(checkinDate);
            checkoutDate.setDate(checkoutDate.getDate() + 3);
            const checkoutStr = checkoutDate.toISOString().split('T')[0];
            this.logger.log(`Fetching hotels for dest_id: ${destId}`);
            const searchRes = await fetch(`https://booking-com.p.rapidapi.com/v1/hotels/search?dest_id=${destId}&dest_type=${destType}&locale=en-gb&filter_by_currency=USD&checkin_date=${checkinStr}&checkout_date=${checkoutStr}&room_number=1&adults_number=2&order_by=popularity&page_number=0&units=metric`, {
                headers: {
                    'x-rapidapi-host': 'booking-com.p.rapidapi.com',
                    'x-rapidapi-key': apiKey
                }
            });
            const searchData = await searchRes.json();
            if (!searchData || !searchData.result || searchData.result.length === 0) {
                return [];
            }
            const hotels = searchData.result.slice(0, 6).map((h) => ({
                name: h.hotel_name,
                type: h.accommodation_type_name ? h.accommodation_type_name.toLowerCase() : 'hotel',
                image: h.max_photo_url || h.main_photo_url || 'https://images.unsplash.com/photo-1542314831-c6a4d27ce6a2?w=800&fit=crop',
                rating: h.review_score ? (h.review_score / 2) : 4.5,
                reviewCount: h.review_nr || Math.floor(Math.random() * 500),
                pricePerNight: h.min_total_price ? Math.round(h.min_total_price / 3) : Math.floor(Math.random() * 300) + 100,
                currency: 'USD',
                location: `${h.city_trans || city}, ${h.country_trans || ''}`.trim().replace(/,$/, ''),
                amenities: h.accommodation_type_name === 'Resort' ? ['Pool', 'Spa', 'Restaurant', 'WiFi'] : ['WiFi', 'Restaurant', 'AC', 'Room Service'],
                verified: true,
                description: h.review_recommendation || `A highly-rated ${h.accommodation_type_name || 'hotel'} situated in the heart of ${city}. Experience exceptional comfort, authentic local culture, and world-class hospitality during your stay.`
            }));
            return hotels;
        }
        catch (error) {
            this.logger.error(`Error fetching real hotels: ${error.message}`);
            return [];
        }
    }
    async findOne(id) {
        return this.prisma.stay.findUnique({
            where: { id },
        });
    }
    async seed(mockData) {
        for (const stay of mockData) {
            await this.prisma.stay.upsert({
                where: { id: stay.id },
                update: stay,
                create: stay,
            });
        }
    }
};
exports.StaysService = StaysService;
exports.StaysService = StaysService = StaysService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_service_1.AiService])
], StaysService);
//# sourceMappingURL=stays.service.js.map