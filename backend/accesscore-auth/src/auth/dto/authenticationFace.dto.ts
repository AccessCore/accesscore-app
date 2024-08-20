import { IsNotEmpty } from "class-validator";

export class AuthenticationFaceDto {
  @IsNotEmpty({ message: 'Face não informada' })
  face: string;
}