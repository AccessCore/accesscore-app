import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';
import { createPasswordHashed } from 'src/utils/password';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto): Promise<User> {

    const user = await this.findByEmail(createUserDto.email).catch(() => undefined);

    if (user) {
      throw new BadRequestException('Email já cadastrado');
    }

    const passwordHashed = await createPasswordHashed(createUserDto.password);

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: passwordHashed,
        status: 'A'
      }
    });
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  findOne(id: number): Promise<User> {
    return this.prisma.user.findFirst({
      where: {
        id
      }
    })
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        email
      }
    });

    if (!user) {
      throw new NotFoundException('Email não localizado');
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: {
        id
      },
      data: {
        ...updateUserDto
      }
    });
  }

  remove(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: {
        id
      }
    });
  }
}
