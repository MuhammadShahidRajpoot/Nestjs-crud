import { User } from "../../auth/schemas/user.schema";
import { IsEmpty, IsNotEmpty } from 'class-validator';
// import { MulterFile } from '../../common/interfaces/multer-file.interface';

export class CreateTaskDto {

    @IsNotEmpty()
    readonly title : string

    @IsNotEmpty()
    readonly description : string

    @IsEmpty({ message: 'You cannot pass user id' })
    readonly user: string;

    image: string
}