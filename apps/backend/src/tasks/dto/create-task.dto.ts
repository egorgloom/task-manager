import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Купить хлеб', description: 'Название задачи' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Купить хлеб', description: 'Название задачи' })
  @IsString()
  @IsOptional()
  description?: string;
}
