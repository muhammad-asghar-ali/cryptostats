import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Coinbase } from './coinbase.model';

@Schema({ versionKey: false })
export class User extends Document {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  coinbase: Coinbase;
}

export const UserSchema = SchemaFactory.createForClass(User);
