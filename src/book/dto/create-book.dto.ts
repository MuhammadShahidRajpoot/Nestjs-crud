import { User } from "../../auth/schemas/user.schema";
import { Category } from "../schemas/book.schema"
import { IsEmpty } from 'class-validator';

export class CreateBookDto {
    readonly title : string
    readonly description : string
    readonly author : string
    readonly price : number
    readonly category : Category

    @IsEmpty({ message: 'You cannot pass user id' })
    readonly user: User;
}