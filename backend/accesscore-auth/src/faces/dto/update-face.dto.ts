import { PartialType } from '@nestjs/mapped-types';
import { CreateFaceDto } from './create-face.dto';

export class UpdateFaceDto extends PartialType(CreateFaceDto) {}
