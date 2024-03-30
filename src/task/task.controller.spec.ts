import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from './schemas/task.schema';
// import { CreateTaskDto } from './dto/create-task.dto';
// import { UpdateTaskDto } from './dto/update-task.dto';

describe('TaskController', () => {
  let controller: TaskController;
  let taskService: TaskService;
    let mockTaskModel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [TaskService,
        {
        provide: getModelToken( Task.name ),
        useValue: mockTaskModel,
      }
    ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllTasks', () => {
    it('should return an array of tasks', async () => {
      const user = { _id: 'user123' };
      const tasks = [
        { title: 'Task 1', description: 'Description 1', user: 'user123', _id: '1', image: null },
        { title: 'Task 2', description: 'Description 2', user: 'user123', _id: '2', image: null },
      ];

      jest.spyOn(taskService, 'findAll').mockResolvedValue( tasks );

      const result = await controller.getAllTasks( user );

      expect(result).toEqual(tasks);
    });
  });

  describe('createTask', () => {
    it('should create a task', async () => {
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        user: 'user123',
        image: null
      };

      const expectedTask = {
        title: 'Test Task',
        description: 'Test Description',
        user: 'user123',
        _id: '1',
        image: null
      };

      const image = { filename: 'test.jpg' }; 

      jest.spyOn(taskService, 'create').mockResolvedValue(expectedTask);

      const result = await controller.createTask(null, createTaskDto, { user: 'user123' });

      expect(result).toEqual(expectedTask);
    });
  });

  describe('getTask', () => {
    it('should return a task by ID', async () => {
      const taskId = '1'; 
      const task = {
        title: 'Test Task',
        description: 'Test Description',
        user: 'user123',
        _id: taskId,
        image: null
      };

      jest.spyOn(taskService, 'findById').mockResolvedValue( task );

      const result = await controller.getTask(taskId);

      expect(result).toEqual(task);
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const taskId = '1'; 
      const updateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
        user: 'user123'
      };

      const expectedUpdatedTask = {
        title: 'Updated Task',
        description: 'Updated Description',
        user: 'user123',
        _id: taskId,
        image: null
      };

      const image = { filename: 'updated.jpg' }; 

      jest.spyOn(taskService, 'updateById').mockResolvedValue(expectedUpdatedTask);

      const result = await controller.updateTask(taskId, updateTaskDto, null);

      expect(result).toEqual(expectedUpdatedTask);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const taskId = '1'; 
      const deletedTask = {
        title: 'Deleted Task',
        description: 'Deleted Description',
        user: 'user123',
        _id: taskId,
        image: null
      };

      jest.spyOn(taskService, 'deleteById').mockResolvedValue(deletedTask);

      const result = await controller.deleteTask(taskId);

      expect(result).toEqual(deletedTask);
    });
  });


});
