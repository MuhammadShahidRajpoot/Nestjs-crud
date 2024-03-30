// import { MulterFile } from "../../common/interfaces/multer-file.interface";
import { User } from "../../auth/schemas/user.schema";
import { IsEmpty } from 'class-validator';


export class UpdateTaskDto {
     title : string
     description : string

    @IsEmpty({ message: 'You cannot pass user id' })
     user: string;

     image?: string
}