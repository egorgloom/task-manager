import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let prisma: PrismaService;

  const mockPrismaService = {
    task: {
      findMany: vi.fn().mockResolvedValue([{ id: 1, title: 'Test Task' }]),
      create: vi
        .fn()
        .mockResolvedValue({ id: 1, title: 'New Task', userId: 1 }),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('должен быть определен', () => {
    expect(service).toBeDefined();
  });

  it('должен возвращать массив задач (findAll)', async () => {
    const tasks = await service.findAll();
    expect(tasks).toEqual([{ id: 1, title: 'Test Task' }]);
    expect(prisma.task.findMany).toHaveBeenCalled();
  });

  it('должен создавать задачу (create)', async () => {
    const dto = { title: 'New Task', description: 'Desc' };
    const userId = 1;

    const result = await service.create(dto, userId);

    expect(result).toEqual({ id: 1, title: 'New Task', userId: 1 });
    expect(prisma.task.create).toHaveBeenCalledWith({
      data: {
        title: dto.title,
        description: dto.description,
        userId: userId,
      },
    });
  });

  it('должен выбрасывать NotFoundException, если задачи нет (remove)', async () => {
    mockPrismaService.task.findUnique.mockResolvedValue(null);
    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
  });
  // ТЕСТ НА УСПЕШНОЕ УДАЛЕНИЕ
  it('должен удалять задачу, если она существует (remove)', async () => {
    // Говорим заглушке, что задача найдена
    mockPrismaService.task.findUnique.mockResolvedValue({
      id: 1,
      title: 'Task',
    });
    mockPrismaService.task.delete.mockResolvedValue({ id: 1, title: 'Task' });

    const result = await service.remove(1);

    expect(result).toEqual({ id: 1, title: 'Task' });
    expect(prisma.task.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  // ТЕСТ НА ОБНОВЛЕНИЕ
  it('должен обновлять задачу, если она существует (update)', async () => {
    const dto = { title: 'Updated Task', status: 'done' };

    // Задача найдена
    mockPrismaService.task.findUnique.mockResolvedValue({
      id: 1,
      title: 'Old Task',
    });
    // Обновление прошло успешно
    mockPrismaService.task.update.mockResolvedValue({
      id: 1,
      title: 'Updated Task',
      status: 'done',
    });

    const result = await service.update(1, dto);

    expect(result).toEqual({ id: 1, title: 'Updated Task', status: 'done' });
    expect(prisma.task.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: dto,
    });
  });
});
