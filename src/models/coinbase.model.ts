import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Coinbase {
  @Prop()
  access_token: string;

  @Prop()
  refresh_token: string;

  @Prop()
  expries: Date;
}

export const CoinbaseSchema = SchemaFactory.createForClass(Coinbase);
