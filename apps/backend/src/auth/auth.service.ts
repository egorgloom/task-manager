import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: AuthDto) {
    const userExist = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (userExist)
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );

    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
      },
    });

    const { password, ...result } = user;

    return result;
  }

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Неверный email или пароль');

    const password = await bcrypt.compare(dto.password, user.password);

    if (!password) throw new UnauthorizedException('Неверный email или пароль');

    const payload = { sub: user.id, email: user.email };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      user: { id: user.id, email: user.email },
    };
  }
}
