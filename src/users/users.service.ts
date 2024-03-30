
import { Injectable, NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
// import { User } from '../auth/schemas/user.schema';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

    constructor(

        @InjectModel( User.name )
        private userModel: mongoose.Model<User>,
    ) {}

    //get all users
    // async findAll( user: any): Promise<User[]> {
    async findAll( user: any): Promise<any> {
        // console.log("user in get all users", user)
        const userROle = user?.role;

        if ( userROle === "admin" ) {

        const users = await this.userModel.find();
        return users

        } else {

            throw new HttpException( 'You are not authorized to access this route', HttpStatus.FORBIDDEN );

        }
    }

    // async findById( user: any, id: string): Promise<User> {
    async findById( user: any, id: string): Promise<any> {

        if ( !mongoose.Types.ObjectId.isValid( id ) ) {
            throw new BadRequestException( 'Invalid User ID' );
        }

        // console.log("user in find by id ", user)
        const userROle = user?.role;

        if (userROle === 'admin') {
          const res = await this.userModel.findById( id );

          if ( !res ) {
            throw new NotFoundException( 'User Not Found!' );
          }
          return res;

        } else {

          throw new HttpException( 'You are not authorized to access this route', HttpStatus.FORBIDDEN );
        }
        
    }

    //update user
    async updateById( user: any, id: string, updatedData: UpdateUserDto ): Promise<any> {

        const userROle = user?.role;

        if (userROle === 'admin') {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid User ID');
        }
    
        const res = await this.userModel.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
    
        if ( !res ) {
            throw new NotFoundException('User Not Found!');
        }

        return { message: "User Updated Successfully!", user: res };
       
        
    } else {

        throw new HttpException( 'You are not authorized to access this route', HttpStatus.FORBIDDEN );
      }
    }

    // delet user
    // async deleteById( user: any, id: string): Promise<User> {
    async deleteById( user: any, id: string): Promise<any> {

        // console.log("user in delete user", user)
        const userROle = user?.role;

        if (userROle === 'admin') {

        return await this.userModel.findByIdAndDelete( id )

    } else {

        throw new HttpException( 'You are not authorized to access this route', HttpStatus.FORBIDDEN );
      }
    }
    
}

