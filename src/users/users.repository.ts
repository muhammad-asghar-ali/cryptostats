import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/models/user.model";

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) {}

  public async insertOne(data: Partial<User>): Promise<User> {
    const user = new this.userModel(data);
    return user.save();
  }

  public async findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }
}
