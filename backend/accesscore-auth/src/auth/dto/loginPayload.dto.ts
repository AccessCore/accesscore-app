import { User } from "src/users/entities/user.entity";

export class LoginPayload {
  id: bigint;

  constructor(user: User) {
    this.id = user.id;
  }
}
