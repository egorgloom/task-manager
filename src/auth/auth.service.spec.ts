import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import * as bcrypt from 'bcrypt';

// Заглушки
const mockPrismaService = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
};

const mockJwtService = {
  signAsync: vi.fn().mockResolvedValue('test-token'),
};

// Мокаем bcrypt (чтобы не тратить время на реальное хеширование)
vi.mock('bcrypt', () => ({
  hash: vi.fn().mockResolvedValue('hashed-password'),
  compare: vi.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  // --- ТЕСТЫ РЕГИСТРАЦИИ ---
  it('должен выбрасывать ошибку, если email уже занят', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue({ id: 1 }); // Юзер найден
    await expect(
      service.register({ email: 'test@mail.com', password: '123' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('должен создавать пользователя и хешировать пароль', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(null); // Юзера нет
    mockPrismaService.user.create.mockResolvedValue({
      id: 1,
      email: 'test@mail.com',
      password: 'hashed-password',
    });

    const result = await service.register({
      email: 'test@mail.com',
      password: '123',
    });

    expect(result).toEqual({ id: 1, email: 'test@mail.com' }); // Пароля быть не должно
    expect(bcrypt.hash).toHaveBeenCalledWith('123', 10);
  });

  // --- ТЕСТЫ ЛОГИНА ---
  it('должен выбрасывать ошибку, если пользователь не найден', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(null);
    await expect(
      service.login({ email: 'test@mail.com', password: '123' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('должен выбрасывать ошибку, если пароль неверный', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue({
      id: 1,
      password: 'hash',
    });
    (bcrypt.compare as any).mockResolvedValue(false); // Пароли не совпали

    await expect(
      service.login({ email: 'test@mail.com', password: '123' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('должен возвращать токен при успешном логине', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'test@mail.com',
      password: 'hash',
    });
    (bcrypt.compare as any).mockResolvedValue(true); // Пароли совпали

    const result = await service.login({
      email: 'test@mail.com',
      password: '123',
    });

    expect(result).toEqual({
      access_token: 'test-token',
      user: { id: 1, email: 'test@mail.com' },
    });
    expect(mockJwtService.signAsync).toHaveBeenCalledWith({
      sub: 1,
      email: 'test@mail.com',
    });
  });
});
