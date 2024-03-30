import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from './schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {
  constructor(
    @InjectModel( User.name )
    private userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "JWT_SECRET",
    });
  }

  async validate( payload ) {
    const { id } = payload;
    const { role } = payload

// console.log("role in jwt", role)
    const user = await this.userModel.findById( id );
    // console.log("user in jwt", user)

    if ( !user ) {
      throw new UnauthorizedException('Login first to access this endpoint.');
    }
// console.log("user", user)
    return user;
  }
}