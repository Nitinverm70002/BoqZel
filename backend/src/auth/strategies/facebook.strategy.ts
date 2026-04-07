import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('FACEBOOK_APP_ID') || 'placeholder-id',
      clientSecret: configService.get<string>('FACEBOOK_APP_SECRET') || 'placeholder-secret',
      callbackURL: `${configService.get<string>('BACKEND_URL') || 'http://localhost:4000'}/auth/facebook/callback`,
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: (err: any, user: any, info?: any) => void): Promise<any> {
    const { name, emails, id } = profile;
    const user = {
      email: emails[0]?.value,
      name: name.givenName && name.familyName ? `${name.givenName} ${name.familyName}` : name.givenName || name.familyName || profile.displayName,
      avatar: `https://graph.facebook.com/${id}/picture?type=large`,
      providerId: id,
      provider: 'facebook',
    };
    done(null, user);
  }
}
