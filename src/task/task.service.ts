import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { Task } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {

    constructor(

        @InjectModel( Task.name )
        private taskModel: mongoose.Model<Task>,
    ) {}
    
    //creat task
    // async create( createTaskDto: CreateTaskDto, user: User, image: Express.Multer.File ): Promise<Task> {
    async create( createTaskDto: CreateTaskDto, user: any, image: any ): Promise<Task> {

        if ( !createTaskDto.title || !createTaskDto.description || !image ) {
            throw new BadRequestException('Please fill in all task fields'); 
        }
        const task = await this.taskModel.create({
            title: createTaskDto.title, description: createTaskDto.description , image: image.filename
        });

        // console.log("task", task)

        const data = Object.assign( task, { user: user._id })

        const res = await this.taskModel.create( data )
        return res
    }

    //get all tasks
    async findAll( user: any ): Promise<Task[]> {
        // console.log("user in get all", user)
        const userId = user._id

        const tasks = await this.taskModel.find( { user: userId } );
        return tasks
    }

    //find task by id
    async findById( id: string ): Promise<Task> {

        if ( !mongoose.Types.ObjectId.isValid( id ) ) { throw new BadRequestException( 'Invalid task ID' ); }

        const task = await this.taskModel.findById( id )

        if ( !task ){
            throw new NotFoundException( "Task Not Found!" )
        }

        return task
    }

    //update task
    // async updateById(id: string, task: UpdateTaskDto, image: Express.Multer.File): Promise<Task> {
    async updateById(id: string, task: any, image: Express.Multer.File): Promise<Task> {

        if ( !mongoose.Types.ObjectId.isValid( id ) ) { throw new BadRequestException( 'Invalid task ID' ); }

        const { title , description } = task
    
        const existingTask = await this.taskModel.findById( id );
    
        if ( !existingTask ) {
            throw new NotFoundException( 'Task Not Found!' );
        }
    
        const updatedData = {
            ...task,
        };
    
        if ( image ) {
            updatedData.image = image.filename;
    
        const res = await this.taskModel.findByIdAndUpdate( id, updatedData, { new: true, runValidators: true } );
    
        if ( !res ) {
            throw new NotFoundException( 'Task Not Found!' );
        }
        return res;

    } else {

        const res = await this.taskModel.findByIdAndUpdate( id, { title, description }, { new: true, runValidators: true } )
        if ( !res ) {
            throw new NotFoundException('Task Not Found!');
        }
        return res
    }

}
    
    

    //delete task
    async deleteById( id: string): Promise<Task> {

        if ( !mongoose.Types.ObjectId.isValid( id ) ) { throw new BadRequestException( 'Invalid task ID' ); }

        return await this.taskModel.findByIdAndDelete( id )
    }
    
}
