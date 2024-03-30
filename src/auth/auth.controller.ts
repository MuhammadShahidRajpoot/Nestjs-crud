import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './schemas/user.schema';

@Controller('auth')
export class AuthController {

    constructor( private authService: AuthService ) {}

    @Post( '/register' )
    async registerUser(
        @Body()
        signUpDto: SignUpDto,

    ): Promise< any > {
        return await this.authService.registerUser( signUpDto )
    }

    @Post( '/login' )
    async loginUser(

        @Body()
        loginDto: LoginDto,
    ): Promise< any > {
        return await this.authService.login( loginDto )
    }    
}
