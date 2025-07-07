import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {

  @Prop({
    required: [true, 'Content is required'],
  })
  content: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
  })
  user: MongooseSchema.Types.ObjectId;

  @Prop({
    default: false,
  })
  is_read: boolean;

  @Prop({
    type: String,
    required: [true, 'Redirect URL is required'],
  })
  redirect_url: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
