import { User } from "src/users/entities/user.entity";

export class Face {
  id: bigint;
  face: string;
  created_at: Date;
  updated_at: Date;
  user: User;
}
