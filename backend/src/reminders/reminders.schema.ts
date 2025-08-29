import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ReminderDocument = Reminder & Document;


@Schema({ timestamps: true })
export class Reminder {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: Date })
  start: Date | string;

  @Prop()
  end?: Date;

  @Prop({ default: 'pending', enum: ['pending', 'complete'] })
  status: 'pending' | 'complete';

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: MongooseSchema.Types.ObjectId;

  @Prop({ default: true })
  alert: boolean;

  @Prop({ type: Number, default: 30 })
  alert_before: number;

  @Prop({ type: Number, default: 0 })
  sort_order: number;

  @Prop({ type: String })
  repeat: any;

  @Prop({ type: [String], required: false })
  days: any;
}

export const ReminderSchema = SchemaFactory.createForClass(Reminder);
