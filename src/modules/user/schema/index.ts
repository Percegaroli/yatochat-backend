import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  id: number;

  @Prop({ minlength: 3, required: true })
  name: string;

  @Prop({ minlength: 5, required: true })
  lastName: string;

  @Prop({ required: true, minlength: 8, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
