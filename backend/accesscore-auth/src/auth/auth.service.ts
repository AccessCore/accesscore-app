import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthenticationDto } from './dto/authentication.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { validatePassword } from 'src/utils/password';
import { LoginPayload } from './dto/loginPayload.dto';
import { ReturnUserDto } from 'src/users/dto/return-user.dto';
import { AuthenticationFaceDto } from './dto/authenticationface.dto';
import { FacesService } from 'src/faces/faces.service';
import { euclideanDistance } from 'src/utils/euclidean-distance';

@Injectable()
export class AuthService {
  private MATCH_THRESHOLD = 0.5; // Defina o limite de distância para uma correspondência válida

  constructor(
    private readonly face: FacesService,
    private readonly user: UsersService,
    private jwtService: JwtService) { }

  async auth(authenticationDto: AuthenticationDto) {
    const user: User | undefined = await this.user.findByEmail(authenticationDto.email).catch(() => undefined);

    const isMatch = await validatePassword(
      authenticationDto.password,
      user?.password || '',
    );

    if (!user || !isMatch) {
      throw new NotFoundException('Email ou senha inválidos');
    } ''

    return {
      accessToken: this.jwtService.sign({ ...new LoginPayload(user) }),
      user: new ReturnUserDto(user),
    };
  }

  async authFace(authenticationFaceDto: AuthenticationFaceDto) {
    const { face } = authenticationFaceDto;

    const descriptors = JSON.parse(face);
    const inputDescriptor = new Float32Array(descriptors);

    console.log('Face:', inputDescriptor);

    const faces = await this.face.findAll();

    if (faces.length === 0) {
      throw new UnauthorizedException('Nenhum usuário com face registrada foi encontrado');
    }

    let bestMatch = null;
    let minDistance = Infinity;

    // Comparar o descriptor recebido com todos os descriptors do banco
    for (const face of faces) {
      if (face.face) {
        const storedDescriptor = new Float32Array(JSON.parse(face.face));
        const distance = euclideanDistance(inputDescriptor, storedDescriptor);

        if (distance < minDistance) {
          minDistance = distance;
          bestMatch = face;
        }
      }
    }

    console.log('Distancia', minDistance);

    if (minDistance <= this.MATCH_THRESHOLD) {
      return {
        accessToken: this.jwtService.sign({ ...new LoginPayload(bestMatch.user) }),
        user: new ReturnUserDto(bestMatch.user),
      };
    } else {
      throw new UnauthorizedException('Autenticação falhou: face não reconhecida');
    }
  }

}
