import { Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
declare const FacebookStrategy_base: new (...args: [options: import("passport-facebook").StrategyOptions] | [options: import("passport-facebook").StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class FacebookStrategy extends FacebookStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(accessToken: string, refreshToken: string, profile: any, done: (err: any, user: any, info?: any) => void): Promise<any>;
}
export {};
