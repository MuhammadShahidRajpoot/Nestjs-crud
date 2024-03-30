import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { getModelToken } from '@nestjs/mongoose';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let mockUserModel;

  const mockUser = {
    _id: 'some-id',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password',
    role: 'user',
    isActive: true,
  };

  const mockUpdateUserDto = {
    _id: 'some-id',
    name: 'John Doe new',
    email: 'john@example.com',
    password: 'password',
    role: 'user',
    isActive: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const mockUsers = [mockUser, mockUser];

      jest.spyOn(usersService, 'findAll').mockResolvedValue(mockUsers);

      const result = await usersController.getAllUsers({ user: { role: 'admin' } });

      expect(result).toEqual(mockUsers);
    });

    it('should throw an exception for non-admin users', async () => {
      await expect(usersController.getAllUsers({ user: { role: 'user' } })).rejects.toThrowError();
    });
  });

  describe('getUser', () => {
    it('should return a user by ID', async () => {
      const mockId = 'some-id';

      jest.spyOn(usersService, 'findById').mockResolvedValue(mockUser);

      expect(await usersController.getUser({ user: { role: 'admin' } }, mockId)).toBe(mockUser);
    });
  });

  describe('updateUser', () => {
    it('should update a user by ID', async () => {
      const mockId = 'some-id';

      jest.spyOn(usersService, 'updateById').mockResolvedValue(mockUser);

      expect(await usersController.updateUser({ user: { role: 'admin' } }, mockId, mockUpdateUserDto)).toBe(mockUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
      const mockId = 'some-id';

      jest.spyOn(usersService, 'deleteById').mockResolvedValue(mockUser);

      expect(await usersController.deleteUser({ user: { role: 'admin' } }, mockId)).toBe(mockUser);
    });
  });
});
