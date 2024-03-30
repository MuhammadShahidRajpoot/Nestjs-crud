import { Controller, Get, Body, Post, Param, Put, Delete, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express/multer'
import { diskStorage } from 'multer';

@Controller('task')
export class TaskController {

    constructor( private taskService: TaskService) {}

    @Get()
    @UseGuards( AuthGuard() )
    async getAllTasks(

        @Req() req
    ): Promise<Task[]> {
        // console.log("req.user",req, req.user)
        return this.taskService.findAll( req.user )
    }

    @Post()
    @UseGuards( AuthGuard() )
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                cb(null, `${file.originalname}`);
            }
        })
    }))
    async createTask(
        @UploadedFile() image: Express.Multer.File ,
        @Body()
        createTaskDto: CreateTaskDto,   
        @Req() req,

    ): Promise<Task> {
    // console.log("image.orign in ctr", image)
        return this.taskService.create( createTaskDto, req.user, image  )
    }

    @Get( ':id' )
    @UseGuards( AuthGuard() )
    async getTask (
        @Param( 'id' )
        id: string,
    ): Promise<Task> {
        return this.taskService.findById( id )
    }
    
    @Put( ':id' )
    @UseGuards( AuthGuard() )
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                cb(null, `${file.originalname}`);
            }
        })
    }))
    async updateTask (
        @Param( 'id' )
        id: string,
        @Body()
        task: UpdateTaskDto,
        @UploadedFile() image: Express.Multer.File,
    ): Promise<Task> {
        return this.taskService.updateById( id, task, image )
    }

    @Delete( ':id' )
    @UseGuards( AuthGuard() )
    async deleteTask (
        @Param( 'id' )
        id: string,
    ): Promise< Task > {
        return this.taskService.deleteById( id )
    }

}

