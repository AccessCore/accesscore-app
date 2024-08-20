import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { FacesService } from './faces.service';
import { CreateFaceDto } from './dto/create-face.dto';
import { UpdateFaceDto } from './dto/update-face.dto';
import { UserId } from 'src/decorators/user-id.decorator';

@Controller('faces')
export class FacesController {
  constructor(private readonly facesService: FacesService) { }

  @UsePipes(ValidationPipe)
  @Post()
  create(@Body() createFaceDto: CreateFaceDto, @UserId() user_id: number) {
    return this.facesService.create(user_id, createFaceDto);
  }

  @Get()
  findAll() {
    return this.facesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFaceDto: UpdateFaceDto) {
    return this.facesService.update(+id, updateFaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facesService.remove(+id);
  }
}
