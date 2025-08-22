import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { AcceptanceLevelEnum, PriorityEnum,ClientAcceptance, TaskStatusEnum, TaskTypeEnum } from './task.interface';

export type TaskDocument = Task & Document;


@Schema({ timestamps: true })
export class Task {
  @Prop({ unique: true, immutable: true })
  code: string;
  @Prop({ required: true })
  title: string;

  @Prop({
    required: true,
    default: false,
  })
  isArchived: Boolean;



  @Prop()
  description: string;

  @Prop({
    type: String,
    enum: Object.values(TaskTypeEnum),
    default: TaskTypeEnum.BACKEND,
  })
  type: TaskTypeEnum;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Project', required: true })
  project: MongooseSchema.Types.ObjectId;

  @Prop({ default: 0 })
  sort_order: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  assigned_to: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  report_to: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ProjectKanban' })
  kanban: MongooseSchema.Types.ObjectId;

  @Prop()
  due_date: Date;

  @Prop({ default: true })
  is_active: boolean;

  @Prop({
    type: String,
    enum: Object.values(PriorityEnum),
    default: PriorityEnum.MEDIUM,
  })
  priority: PriorityEnum;

   @Prop({
    type: String,
    enum: Object.values(ClientAcceptance),
    default: ClientAcceptance.PENDING,
  })
  client_acceptance :ClientAcceptance;

  @Prop({
    type: String,
    enum: Object.values(TaskStatusEnum),
    default: TaskStatusEnum.BACKLOG,
  })
  status: TaskStatusEnum;

  @Prop({ type: Number })
  estimated_time: number;

  @Prop({
    type: String,
    enum: Object.values(AcceptanceLevelEnum),
  })
  acceptance: AcceptanceLevelEnum;

  @Prop({ type: Number, default: 0 })
  rivision: { type: Number, default: 0 }


  @Prop({ type: Number, default: 0 })
  totaltaskminutes: { type: Number, default: 0 }

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  created_by: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  updated_by: MongooseSchema.Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
