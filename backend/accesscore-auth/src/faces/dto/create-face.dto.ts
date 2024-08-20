import { IsNotEmpty } from "class-validator";

export class CreateFaceDto {
  @IsNotEmpty({ message: 'Face não informada' })
  face: string;
}
