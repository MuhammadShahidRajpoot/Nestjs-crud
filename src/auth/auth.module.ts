import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserSchema } from './schemas/user.schema';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [ 
    PassportModule.register( { defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'JWT_SECRET',
      signOptions: { expiresIn: '1d' },
}),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [ AuthController ],
  providers: [ AuthService, JwtStrategy ],
  exports: [ JwtStrategy, PassportModule ]
})
export class AuthModule {}
