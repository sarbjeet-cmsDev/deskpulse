import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type TaskChecklistDocument = TaskChecklist & Document;

@Schema({ timestamps: true })
export class TaskChecklist {
  @Prop({
    type: String,
    required: [true, 'Title is required'],
  })
  title: string;

  @Prop({
    type: String,
    enum: {
      values: ['pending', 'complete'],
      message: 'Status must be either "pending" or "complete"',
    },
    required: [true, 'Status is required'],
    default: 'pending',
  })
  status: 'pending' | 'complete';

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Task',
    required: [true, 'Task reference is required'],
  })
  task: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  created_by: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  completed_by: MongooseSchema.Types.ObjectId;

  @Prop({
    type: Boolean,
    default: true,
    required: [true, 'Visibility is required'],
  })
  visibility: boolean;

  @Prop({
    type: Number,
    default: 30,
    required: [true, 'Estimate time is required'],
    validate: {
      validator: (value: number) => value >= 0,
      message: 'Estimate time must be a non-negative number',
    },
  })
  estimate_time: number;
}

export const TaskChecklistSchema = SchemaFactory.createForClass(TaskChecklist);
