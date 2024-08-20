import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({ message: 'Nome deve ser informado' })
  name: string;

  @IsNotEmpty({ message: 'Email deve ser informado' })
  email: string;

  @IsNotEmpty({ message: 'Fone deve ser informado' })
  phone: string;

  @IsNotEmpty({ message: 'Senha deve ser informada' })
  password: string;
}
