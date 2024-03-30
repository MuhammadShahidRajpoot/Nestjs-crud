import { Module,  } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { MongooseModule } from "@nestjs/mongoose";
// import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from '../auth/auth.module';
import { TaskSchema } from './schemas/task.schema';

@Module({

  imports: [ 
    AuthModule,
    MongooseModule.forFeature( [ { name: 'Task', schema: TaskSchema } ] ),
  //   MulterModule.register({
  //     destin\: './uploads',
  // })],
  ],
  controllers: [TaskController],
  providers: [TaskService]
})
export class TaskModule {}
