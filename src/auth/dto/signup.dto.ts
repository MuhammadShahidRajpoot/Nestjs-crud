import { IsEnum } from 'class-validator';

// import { IsNotEmpty } from "class-validator";


export class SignUpDto {

    readonly name: string;
    readonly email: string;  
    readonly password: string;

    @IsEnum(['user', 'admin'])
    readonly role: string;

    readonly isActive: boolean;
    
  }