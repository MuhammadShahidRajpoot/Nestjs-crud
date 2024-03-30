import { Injectable, ConflictException, BadRequestException, UnauthorizedException, ForbiddenException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService,
    ) {}

    //register user
    async registerUser(signUpDto: SignUpDto): Promise<any> {
        const { name, email, password, role } = signUpDto;

        if ( !name || !email || !password ) {
            throw new BadRequestException('Please fill in all fields'); 
        }

        const existName = await this.userModel.findOne({ name });

        if ( existName ) {
            throw new ConflictException('User with the provided name already exists');
        }

        const existEmail = await this.userModel.findOne({ email });

        if ( existEmail ) {
            throw new ConflictException('User with the provided email already exists');
        }

        const hashedPassword = await bcrypt.hash( password, 10 );

        const user = await this.userModel.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        // const token = await this.jwtService.sign({ id: user._id });

        
        return user;
    }

    //login user
    async login( loginDto: LoginDto ): Promise< any > {

        const { email, password } = loginDto;
    
        const user = await this.userModel.findOne({ email });
    
        if ( !user ) {
          throw new UnauthorizedException( 'Invalid email or password' );
        }
        if ( !user.isActive ) {
            throw new ForbiddenException( 'Permission Denied By Admin' )
        }
    
        const isPasswordMatched = await bcrypt.compare( password, user.password );
    
        if ( !isPasswordMatched ) {
          throw new UnauthorizedException( 'Invalid email or password' );
        }
    
        const token = this.jwtService.sign( { id: user._id, role: user.role } );
    
        const res = { message: "User Loged In Successfully!", token, user };
        return res;
      }
}
