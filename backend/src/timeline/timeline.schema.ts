import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type TimelineDocument = Timeline & Document;

@Schema({ timestamps: true })
export class Timeline {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Task', required: true })
  task: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, min: 0 })
  time_spent: number; // Time spent in hours

  @Prop()
  comment: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const TimelineSchema = SchemaFactory.createForClass(Timeline);
