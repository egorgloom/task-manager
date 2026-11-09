import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // Создаем адаптер, который берет URL из .env
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    // Передаем адаптер в PrismaClient
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
