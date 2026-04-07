import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || 'placeholder-id',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || 'placeholder-secret',
      callbackURL: `${configService.get<string>('BACKEND_URL') || 'http://localhost:4000'}/auth/google/callback`,
      scope: ['email', 'profile'],
    } as any);
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos, id } = profile;
    const user = {
      email: emails[0].value,
      name: name.givenName && name.familyName ? `${name.givenName} ${name.familyName}` : name.givenName || name.familyName || profile.displayName,
      avatar: photos[0]?.value,
      providerId: id,
      provider: 'google',
    };
    done(null, user);
  }
}
