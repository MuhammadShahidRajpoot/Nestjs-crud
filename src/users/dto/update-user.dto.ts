import { IsEnum } from 'class-validator';

// import { IsNotEmpty } from "class-validator";


export class UpdateUserDto {

     name: string;
     email: string;  
     password: string;

    @IsEnum(['user', 'admin'])
     role: string;

     isActive: boolean;
    
  }