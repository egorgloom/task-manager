import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { describe, beforeEach, vi, it, expect } from 'vitest';

describe('TasksController', () => {
  let controller: TasksController;

  const mockTasksService = {
    findAll: vi.fn().mockResolvedValue([]),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: vi.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('должен быть определен', () => {
    expect(controller).toBeDefined();
  });

  it('должен возвращать пустой массив при вызове findAll', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([]);
    expect(mockTasksService.findAll).toHaveBeenCalled();
  });
});
