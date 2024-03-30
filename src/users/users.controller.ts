
import { Controller, Get, Body, Post, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
// import { CreateuserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {

    constructor( private usersService: UsersService) {}

    @Get()
    @UseGuards( AuthGuard() )
    async getAllUsers(
        @Req() req
    ): Promise<User[]> {
    // ): Promise<any> {
        return this.usersService.findAll( req.user )
    }
   
    @Get( ':id' )
    @UseGuards( AuthGuard() )
    async getUser (
        @Req() req,
        @Param( 'id' )
        id: string,
    ): Promise<User> {
        return this.usersService.findById( req.user , id )
    }
    
    @Put( ':id' )
    @UseGuards( AuthGuard() )
    async updateUser (
        @Req() req,
        @Param( 'id' )
        id: string,
        @Body()
        user: UpdateUserDto,
    ): Promise<User> {
        return this.usersService.updateById( req.user, id, user )
    }

    @Delete( ':id' )
    @UseGuards( AuthGuard() )
    async deleteUser (
        @Req() req,
        @Param( 'id' )
        id: string,
    ): Promise< User > {
        return this.usersService.deleteById( req.user, id )
    }
}

