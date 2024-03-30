import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let mockUserModel;
  let mockJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerUser', () => {
    it('should register a user', async () => {
      const signUpDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        role: 'user',
        isActive: true
      };
      const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

      jest.spyOn(controller, 'registerUser').mockResolvedValue({
        _id: '12345',
        ...signUpDto,
        password: hashedPassword,
      });

      const result = await controller.registerUser(signUpDto);

      expect(result).toEqual({
        _id: '12345',
        ...signUpDto,
        password: hashedPassword,
      });
    });
  });

  describe('loginUser', () => {
    it('should log in a user', async () => {
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'password123',
      };

      const hashedPassword = await bcrypt.hash(loginDto.password, 10);
      const user = {
        _id: '12345',
        name: 'John Doe',
        email: loginDto.email,
        password: hashedPassword,
        role: 'user',
        isActive: true,
      };

      jest.spyOn(authService, 'login').mockResolvedValue({
        message: 'User Loged In Successfully!',
        token: 'token123',
        user,
      });

      const result = await controller.loginUser(loginDto);

      expect(result).toEqual({
        message: 'User Loged In Successfully!',
        token: 'token123',
        user,
      });
    });
  });
});
