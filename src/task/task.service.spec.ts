import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getModelToken } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';


describe('TaskService', () => {
  let taskService: TaskService;
  let mockTaskModel;

  beforeEach(async () => {
    mockTaskModel = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getModelToken( Task.name ),
          useValue: mockTaskModel,
        },
      ],
    }).compile();

    taskService = module.get<TaskService>( TaskService );
  });

  it('should be defined', () => {
    expect( taskService ).toBeDefined();
  });

  //create task
  describe( 'create', () => {

      it( 'should create a task', async () => {
        const createTaskDto = {
          _id: "12345",
          title: 'Test Task',
          description: 'Test Description',
          user: null,
          image: 'test.jpg',
        };
  
        const user ={
          _id: "user123",
           name: "abc",
           email: "a@gmail.com", 
           password: "string",
           role: "user",    
           isActive: true,
        }
        const image = { filename: 'test.jpg' };
  
        const expectedTask = {
          _id: "12345",
          title: 'Test Task',
          description: 'Test Description',
          user: 'user123',
          image: 'test.jpg',
        };
  
        jest.spyOn( mockTaskModel, 'create' ).mockResolvedValue( expectedTask );
        const result = await taskService.create( createTaskDto, user, image );
  
        expect( result ).toEqual( expectedTask );
        expect( mockTaskModel.create ).toHaveBeenCalledWith({
          _id: "12345",
          title: createTaskDto.title,
          description: createTaskDto.description,
          image: image.filename,
          user: user._id,
        });
      });

    it('should throw a BadRequestException if fields are missing', async () => {
      const createTaskDto = {
        title: null,
        description: null,
        user: 'user123',
        image: 'test.jpg',
      };
      const user = { _id: 'user123' };
      const image = { filename: 'test.jpg' };

      await expect( taskService.create( createTaskDto, user, image )).rejects.toThrowError(
        BadRequestException,
      );
    });
  });

  // find all tasks
  describe( 'findAll', () => {
    it( 'should find all tasks for a user', async () => {
      const user = { _id: 'user123' };
      const tasks = [
        { title: 'Task 1', description: 'Description 1', user: 'user123' },
        { title: 'Task 2', description: 'Description 2', user: 'user123' },
      ];

      mockTaskModel.find.mockResolvedValue( tasks );

      const result = await taskService.findAll( user );

      expect( result ).toEqual( tasks );
      expect( mockTaskModel.find ).toHaveBeenCalledWith({ user: user._id });
    });
  });

  //find by id
  describe( 'findById', () => {
    it('should find a task by ID', async () => {
      const taskId = '65142186abcda6f243805dc2';
      const task = { title: 'Test Task', description: 'Test Description', user: 'user123', _id: taskId, };

      mockTaskModel.findById.mockResolvedValue( task );

      const result = await taskService.findById( task._id );
      // console.log("result", result)

      expect( result ).toEqual( task );
      expect( mockTaskModel.findById ).toHaveBeenCalledWith( task._id );
    });

    it( 'should throw a BadRequestException for an invalid task ID', async () => {
      const invalidId = 'invalidId';

      await expect( taskService.findById( invalidId )).rejects.toThrowError( BadRequestException );
    });

    it( 'should throw a NotFoundException if task is not found', async () => {
      
      const taskId = '65142186abcda6f243805dc5';
      const task = { title: 'Test Task', description: 'Test Description', user: 'user123', _id: "65142186abcda6f243805dc2", };

      mockTaskModel.findById.mockResolvedValue( !task );

      await expect( taskService.findById( taskId )).rejects.toThrowError( NotFoundException );
    });
  });

  //update by id
  it( 'should update a task by ID', async () => {
    const taskId = '65142186abcda6f243805dc2';
    const task = { title: 'Test Task', description: 'Test Description', user: 'user123', _id: taskId, };
  
    mockTaskModel.findById.mockResolvedValue( task );
  
    const result = await taskService.findById( task._id );
  
    expect( result ).toEqual( task );
    expect( mockTaskModel.findById ).toHaveBeenCalledWith( task._id );
  
    const updatedTask = { title: 'New Updated Task', description: 'Updated Description', _id: taskId };
    const { title , description, _id } = updatedTask
  
    mockTaskModel.findByIdAndUpdate.mockResolvedValue( updatedTask );
  
    const res = await taskService.updateById( _id, { title, description }, null );
  
    expect( res ).toEqual( updatedTask );
    expect( mockTaskModel.findByIdAndUpdate ).toHaveBeenCalledWith(
      _id,
      { title, description },
      { new: true, runValidators: true },
    );

  });
  

  // delete by id
  describe( 'deleteById', () => {
    it( 'should delete a task by ID', async () => {

        const taskId = '65142186abcda6f243805dc2';
      const deletedTask = {
        _id: taskId,
        title: 'Deleted Task',
        description: 'Deleted Description',
      };
    
      mockTaskModel.findByIdAndDelete.mockResolvedValue( deletedTask );
    
      const result = await taskService.deleteById( deletedTask._id );
    
      expect( result ).toEqual( deletedTask );
      expect( mockTaskModel.findByIdAndDelete ).toHaveBeenCalledWith( deletedTask._id );
    });

    it( 'should throw a BadRequestException for an invalid task ID', async () => {
      const invalidId = 'invalidId';

      await expect( taskService.deleteById( invalidId )).rejects.toThrowError( BadRequestException ); 
  });
  });
});





