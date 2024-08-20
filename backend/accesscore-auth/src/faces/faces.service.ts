import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFaceDto } from './dto/create-face.dto';
import { UpdateFaceDto } from './dto/update-face.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Face } from './entities/face.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FacesService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly user: UsersService) { }

  async create(user_id: number, createFaceDto: CreateFaceDto): Promise<Face> {
    const user = await this.user.findOne(user_id);

    if (!user) {
      throw new NotFoundException('Usuário não localizado');
    }

    return this.prisma.face.create({
      data: {
        ...createFaceDto,
        user_id
      },
      include: {
        user: true
      }
    });
  }

  findAll(): Promise<Face[]> {
    return this.prisma.face.findMany({
      include: {
        user: true
      }
    });
  }

  findOne(id: number): Promise<Face> {
    return this.prisma.face.findFirst({
      where: {
        id
      },
      include: {
        user: true
      }
    });
  }

  update(id: number, updateFaceDto: UpdateFaceDto): Promise<Face> {
    return this.prisma.face.update({
      where: {
        id
      },
      data: updateFaceDto,
      include: {
        user: true
      }
    });
  }

  remove(id: number): Promise<Face> {
    return this.prisma.face.delete({
      where: {
        id
      },
      include: {
        user: true
      }
    });
  }
}
