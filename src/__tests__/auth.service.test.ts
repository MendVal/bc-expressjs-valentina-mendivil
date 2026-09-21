jest.mock('../repositories/users.repository');
jest.mock('bcrypt');
jest.mock('../utils/jwt');

import bcrypt from 'bcrypt';
import * as usersRepository from '../repositories/users.repository';
import * as authService from '../services/auth.service';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';

const mockFindByEmail = usersRepository.findByEmail as jest.MockedFunction<typeof usersRepository.findByEmail>;
const mockFindByEmailWithPassword = usersRepository.findByEmailWithPassword as jest.MockedFunction<typeof usersRepository.findByEmailWithPassword>;
const mockFindByIdWithTokens = usersRepository.findByIdWithTokens as jest.MockedFunction<typeof usersRepository.findByIdWithTokens>;
const mockFindById = usersRepository.findById as jest.MockedFunction<typeof usersRepository.findById>;
const mockCreate = usersRepository.create as jest.MockedFunction<typeof usersRepository.create>;
const mockUpdateRefreshToken = usersRepository.updateRefreshToken as jest.MockedFunction<typeof usersRepository.updateRefreshToken>;

const mockBcryptHash = bcrypt.hash as unknown as jest.MockedFunction<any>;
const mockBcryptCompare = bcrypt.compare as unknown as jest.MockedFunction<any>;

const mockSignAccessToken = signAccessToken as jest.MockedFunction<typeof signAccessToken>;
const mockSignRefreshToken = signRefreshToken as jest.MockedFunction<typeof signRefreshToken>;
const mockVerifyRefreshToken = verifyRefreshToken as jest.MockedFunction<typeof verifyRefreshToken>;

const userBase = {
  _id: { toString: () => 'user-id-123' },
  email: 'test@arcade.com',
  password: 'hashed-password',
  name: 'Test User',
  role: 'user',
  refreshToken: 'hashed-refresh-token',
} as any;

describe('AuthService — Unit Tests', () => {
  describe('register()', () => {
    const dto = { email: 'new@arcade.com', password: 'Password1', name: 'New User' };

    it('should create and return the new user when email is not taken', async () => {
      mockFindByEmail.mockResolvedValue(null);
      mockBcryptHash.mockResolvedValue('hashed-password');
      mockCreate.mockResolvedValue({ ...userBase, email: dto.email });

      const result = await authService.register(dto);

      expect(mockBcryptHash).toHaveBeenCalledWith(dto.password, 10);
      expect(mockCreate).toHaveBeenCalledWith({ ...dto, password: 'hashed-password' });
      expect(result.email).toBe(dto.email);
    });

    it('should throw AppError 409 when email already exists', async () => {
      mockFindByEmail.mockResolvedValue(userBase);
      await expect(authService.register(dto)).rejects.toMatchObject({ statusCode: 409 });
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  describe('login()', () => {
    const dto = { email: 'test@arcade.com', password: 'Password1' };

    it('should return tokens when credentials are valid', async () => {
      mockFindByEmailWithPassword.mockResolvedValue(userBase);
      mockBcryptCompare.mockResolvedValue(true);
      mockSignAccessToken.mockReturnValue('access-token');
      mockSignRefreshToken.mockReturnValue('refresh-token');
      mockBcryptHash.mockResolvedValue('hashed-refresh-token');

      const result = await authService.login(dto);

      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(mockUpdateRefreshToken).toHaveBeenCalledWith('user-id-123', 'hashed-refresh-token');
    });

    it('should throw AppError 401 when user does not exist', async () => {
      mockFindByEmailWithPassword.mockResolvedValue(null);
      await expect(authService.login(dto)).rejects.toMatchObject({ statusCode: 401 });
    });

    it('should throw AppError 401 when password does not match', async () => {
      mockFindByEmailWithPassword.mockResolvedValue(userBase);
      mockBcryptCompare.mockResolvedValue(false);
      await expect(authService.login(dto)).rejects.toMatchObject({ statusCode: 401 });
    });
  });

  describe('refresh()', () => {
    it('should return new tokens when refresh token is valid', async () => {
      mockVerifyRefreshToken.mockReturnValue({ sub: 'user-id-123' } as any);
      mockFindByIdWithTokens.mockResolvedValue(userBase);
      mockBcryptCompare.mockResolvedValue(true);
      mockSignAccessToken.mockReturnValue('new-access-token');
      mockSignRefreshToken.mockReturnValue('new-refresh-token');
      mockBcryptHash.mockResolvedValue('new-hashed-refresh');

      const result = await authService.refresh('valid-refresh-token');

      expect(result.accessToken).toBe('new-access-token');
      expect(mockUpdateRefreshToken).toHaveBeenCalledWith('user-id-123', 'new-hashed-refresh');
    });

    it('should throw AppError 401 when token signature is invalid', async () => {
      mockVerifyRefreshToken.mockImplementation(() => {
        throw new Error('invalid signature');
      });
      await expect(authService.refresh('bad-token')).rejects.toMatchObject({ statusCode: 401 });
    });

    it('should throw AppError 401 when user has no stored refresh token', async () => {
      mockVerifyRefreshToken.mockReturnValue({ sub: 'user-id-123' } as any);
      mockFindByIdWithTokens.mockResolvedValue({ ...userBase, refreshToken: undefined });
      await expect(authService.refresh('valid-token')).rejects.toMatchObject({ statusCode: 401 });
    });

    it('should throw AppError 401 when stored hash does not match', async () => {
      mockVerifyRefreshToken.mockReturnValue({ sub: 'user-id-123' } as any);
      mockFindByIdWithTokens.mockResolvedValue(userBase);
      mockBcryptCompare.mockResolvedValue(false);
      await expect(authService.refresh('valid-token')).rejects.toMatchObject({ statusCode: 401 });
    });
  });

  describe('logout()', () => {
    it('should clear the stored refresh token', async () => {
      await authService.logout('user-id-123');
      expect(mockUpdateRefreshToken).toHaveBeenCalledWith('user-id-123', undefined);
    });
  });

  describe('getMe()', () => {
    it('should return the user when found', async () => {
      mockFindById.mockResolvedValue(userBase);
      const result = await authService.getMe('user-id-123');
      expect(result).toEqual(userBase);
    });

    it('should throw AppError 404 when user does not exist', async () => {
      mockFindById.mockResolvedValue(null);
      await expect(authService.getMe('nope')).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});

export {};