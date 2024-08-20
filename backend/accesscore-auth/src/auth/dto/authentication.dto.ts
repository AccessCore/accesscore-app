import { IsNotEmpty } from "class-validator";

export class AuthenticationDto {
  @IsNotEmpty({ message: 'Email não informado' })
  email: string;

  @IsNotEmpty({ message: 'Senha não informada' })
  password: string;
}