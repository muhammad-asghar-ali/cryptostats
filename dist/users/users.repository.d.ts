import { Model } from "mongoose";
import { User } from "src/models/user.model";
export declare class UsersRepository {
    private readonly userModel;
    constructor(userModel: Model<User>);
    insertOne(data: Partial<User>): Promise<User>;
    findOneByEmail(email: string): Promise<User>;
}
