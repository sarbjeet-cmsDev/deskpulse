// taskactivitylog.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { IsNotEmpty, IsString } from 'class-validator';

export type TaskactivitylogDocument = Taskactivitylog & Document;

@Schema({ timestamps: true })
export class Taskactivitylog {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Task',
  })
  task: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, ref: 'Task' })
  code: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Project',
  })
  project: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;
}

export const TaskChecklistSchema = SchemaFactory.createForClass(Taskactivitylog);
