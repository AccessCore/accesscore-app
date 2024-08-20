import { Module } from '@nestjs/common';
import { FacesService } from './faces.service';
import { FacesController } from './faces.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [FacesController],
  providers: [FacesService, PrismaService, UsersService],
})
export class FacesModule { }
