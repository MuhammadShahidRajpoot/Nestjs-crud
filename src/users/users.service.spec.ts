import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { NotFoundException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let mockUserModel;

  beforeEach(async () => {
    mockUserModel = {
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users for admin', async () => {
      const user = { role: 'admin' };
      const users = [
        {
          _id: "6514403e1e19f64cc6fbe65b",
          name: ' alisha',
          email: 'alisha@gmail.com',
          password: '$2a$10$0pqz9AWRaYdAWjFu80SyP..U4ST41b3Z9vZidWzrpQ9Zd/KZIYebK',
          role: 'admin',
          isActive: true,
          createdAt: '2023-09-27T14:46:22.719Z',
          updatedAt: '2023-09-27T14:46:22.719Z',
          __v: 0
        },
        {
          _id: "6514403e1e19f64cc6fbe65b",
          name: ' alisha',
          email: 'alisha@gmail.com',
          password: '$2a$10$0pqz9AWRaYdAWjFu80SyP..U4ST41b3Z9vZidWzrpQ9Zd/KZIYebK',
          role: 'admin',
          isActive: true,
          createdAt: '2023-09-27T14:46:22.719Z',
          updatedAt: '2023-09-27T14:46:22.719Z',
          __v: 0
        },
        // { name: 'User 2', email: 'user2@example.com', role: 'user' },
      ];

      mockUserModel.find.mockResolvedValue(users);

      const result = await usersService.findAll(user);

      expect(result).toEqual(users);
    });

    it('should throw an exception for non-admin users', async () => {
      const user = { role: 'user' };

      await expect(usersService.findAll(user)).rejects.toThrowError(
        new HttpException('You are not authorized to access this route', HttpStatus.FORBIDDEN)
      );
    });
  });

  describe('findById', () => {
    it('should return a user by ID for admin', async () => {
      const user = { role: 'admin' };
      const id = '65142186abcda6f243805dc2';
      const userData = {  _id:id, name: 'User 1', email: 'user1@example.com', role: 'user', isActive: true };

      mockUserModel.findById.mockResolvedValue(userData);

      const result = await usersService.findById(user, id);

      expect(result).toEqual(userData);
    });

    it('should throw an exception for invalid ID', async () => {
      const user = { role: 'admin' };
      const id = 'invalid-id';

      await expect(usersService.findById(user, id)).rejects.toThrowError(
        new BadRequestException('Invalid User ID')
      );
    });

    it('should throw an exception if user is not admin', async () => {
      const user = { role: 'user' };
      const id = '65142186abcda6f243805dc2';

      await expect(usersService.findById(user, id)).rejects.toThrowError(
        new HttpException('You are not authorized to access this route', HttpStatus.FORBIDDEN)
      );
    });

    it('should throw an exception if user is admin but user is not found', async () => {
      const user = { role: 'admin' };
      const id = '65142186abcda6f243805dc2'; 
    
      mockUserModel.findById.mockResolvedValue(null);
    
      await expect(usersService.findById(user, id)).rejects.toThrowError(
        new NotFoundException('User Not Found!')
      );
    });
    
    
  });

  describe('updateById', () => {
    it('should update a user by ID for admin', async () => {
      const user = { role: 'admin' };
      const id = '65142186abcda6f243805dc2';
      const updateData = { _id:id, name: 'User', email: 'updated@example.com', password: 'newpassword', role: 'user', isActive: true };
      const updatedUser = { _id: '65142186abcda6f243805dc2', name: 'Updated User', ...updateData };
  
      mockUserModel.findByIdAndUpdate.mockResolvedValue(updatedUser);
  
      const result = await usersService.updateById(user, id, updateData);
  
      expect(result).toEqual({ message: 'User Updated Successfully!', user: updatedUser });
    });
  
    it('should throw an exception for invalid ID', async () => {
      const user = { role: 'admin' };
      const id = 'invalid-id';
      const updateData = { name: 'User', email: 'updated@example.com', password: 'newpassword', role: 'user', isActive: true };
  
      await expect(usersService.updateById(user, id, updateData)).rejects.toThrowError(
        new BadRequestException('Invalid User ID')
      );
    });
  
    it('should throw an exception if user is not admin', async () => {
      const user = { role: 'user' };
      const id = '65142186abcda6f243805dc2';
      const updateData = { name: 'User', email: 'updated@example.com', password: 'newpassword', role: 'user', isActive: true };
  
      await expect(usersService.updateById(user, id, updateData)).rejects.toThrowError(
        new HttpException('You are not authorized to access this route', HttpStatus.FORBIDDEN)
      );
    });
  
    it('should throw an exception if user is admin but user is not found', async () => {
      const user = { role: 'admin' };
      const id = '65142186abcda6f243805dc2';
      const updateData = { name: 'User', email: 'updated@example.com', password: 'newpassword', role: 'user', isActive: true };
  
      mockUserModel.findByIdAndUpdate.mockResolvedValue(null);
  
      await expect(usersService.updateById(user, id, updateData)).rejects.toThrowError(
        new NotFoundException('User Not Found!')
      );
    });
  });
  



  describe('deleteById', () => {
    it('should delete a user by ID for admin', async () => {
      const user = { role: 'admin' };
      const id = '65142186abcda6f243805dc2';
      const deletedUser = { _id: '65142186abcda6f243805dc2', name: 'Deleted User', email: 'user1@example.com', role: 'user' };

      mockUserModel.findByIdAndDelete.mockResolvedValue(deletedUser);

      const result = await usersService.deleteById(user, id);

      expect(result).toEqual(deletedUser);
    });

    // it('should throw an exception for invalid ID', async () => {
    //   const user = { role: 'admin' };
    //   const id = 'invalid-id';

    //   await expect(usersService.findById(user, id)).rejects.toThrowError(
    //     new BadRequestException('Invalid User ID')
    //   );
    // });

    it('should throw an exception if user is not admin', async () => {
      const user = { role: 'user' };
      const id = '65142186abcda6f243805dc2';

      await expect(usersService.deleteById(user, id)).rejects.toThrowError(
        new HttpException('You are not authorized to access this route', HttpStatus.FORBIDDEN)
      );
    });

  });
  
});

