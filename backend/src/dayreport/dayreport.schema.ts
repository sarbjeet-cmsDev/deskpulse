import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type DayReportDocument = DayReport & Document;

@Schema({ timestamps: true })
export class DayReport {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: MongooseSchema.Types.ObjectId;

  @Prop([{
    task: { type: MongooseSchema.Types.ObjectId, ref: 'Task', required: true },
    time_spent: { type: Number, required: true, min: 0 },
    comment: { type: String, required: false },
    blocker: { type: String, required: false }
  }])
  tasks: {
    task: MongooseSchema.Types.ObjectId;
    time_spent: number;
    comment?: string;
    blocker?: string;
  }[];

  @Prop([{
    task: { type: MongooseSchema.Types.ObjectId, ref: 'Task', required: true },
    time_spent: { type: Number, required: true, min: 0 },
    comment: { type: String, required: false },
    blocker: { type: String, required: false }
  }])
  next_tasks: {
    task: MongooseSchema.Types.ObjectId;
    time_spent: number;
    comment?: string;
    blocker?: string;
  }[];

  @Prop({ required: false })
  comment: string;

  @Prop({ required: true })
  date: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const DayReportSchema = SchemaFactory.createForClass(DayReport);
