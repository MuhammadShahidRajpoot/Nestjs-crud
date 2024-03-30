import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserModel;
  let mockJwtService;

  beforeEach(async () => {
    mockUserModel = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
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

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
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

      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue({
        _id: '12345',
        ...signUpDto,
        password: hashedPassword,
      });

      const result = await authService.registerUser(signUpDto);

      expect(result).toEqual({
        _id: '12345',
        ...signUpDto,

        password: hashedPassword,
      });
    });

    it('should throw BadRequestException if required fields are missing', async () => {
      const signUpDto = {
        name: null,
        email: 'john@example.com',
        password: 'password',
        role: 'user',
        isActive: true
      };

      await expect(authService.registerUser(signUpDto)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should throw ConflictException if name or email already exists', async () => {
      const signUpDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        role: 'user',
        isActive: true
      };

      mockUserModel.findOne.mockResolvedValue({});

      await expect(authService.registerUser(signUpDto)).rejects.toThrowError(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'password',
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

      mockUserModel.findOne.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue('token123');

      const result = await authService.login(loginDto);

      expect(result).toEqual({
        message: 'User Loged In Successfully!',
        token: 'token123',
        user,
      });
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'password',
      };

      mockUserModel.findOne.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      const hashedPassword = await bcrypt.hash('password', 10);

      const user = {
        _id: '12345',
        name: 'John Doe',
        email: loginDto.email,
        password: hashedPassword,
        role: 'user',
        isActive: true,
      };

      mockUserModel.findOne.mockResolvedValue(user);

      await expect(authService.login(loginDto)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it('should throw ForbiddenException if user is not active', async () => {
      const loginDto: LoginDto = {
        email: 'john@example.com',
        password: 'password',
      };

      const hashedPassword = await bcrypt.hash('password', 10);

      const user = {
        _id: '12345',
        name: 'John Doe',
        email: loginDto.email,
        password: hashedPassword,
        role: 'user',
        isActive: false,
      };

      mockUserModel.findOne.mockResolvedValue(user);

      await expect(authService.login(loginDto)).rejects.toThrowError(
        ForbiddenException,
      );
    });
  });
});
