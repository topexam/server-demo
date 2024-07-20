import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';

import { CreateUserDTO } from '../dto';
import { ILeanUserDocument, IUserDocument, UserModel } from '../schemas';

export class UserRepository {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: SoftDeleteModel<IUserDocument>,
  ) {}

  async createUser(createUserDTO: CreateUserDTO): Promise<string> {
    const userCreated = await new this.userModel({
      email: createUserDTO.email,
      username: createUserDTO.username,
      avatar: createUserDTO.avatar,
      first_name: createUserDTO.first_name,
      last_name: createUserDTO.last_name,
      middle_name: createUserDTO.middle_name,
      _id: createUserDTO.id,
    }).save();
    return userCreated.id;
  }

  async getUserItem(userId: string): Promise<ILeanUserDocument> {
    return this.userModel.findById(userId).lean();
  }
}
