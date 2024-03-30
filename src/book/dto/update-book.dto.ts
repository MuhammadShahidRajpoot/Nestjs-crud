import { User } from "../../auth/schemas/user.schema";
import { Category } from "../schemas/book.schema"
import { IsEmpty } from 'class-validator';


export class UpdateBookDto {
     title : string
     description : string
     author : string
     price : number
     category : Category

    @IsEmpty({ message: 'You cannot pass user id' })
     user: User;
}