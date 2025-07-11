import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PerformanceDocument = Performance & Document;

@Schema({ timestamps: true })
export class Performance {
    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'Task',
    })
    task: MongooseSchema.Types.ObjectId;

    @Prop({
        required: [true, 'result is required'],
    })
    result: string;
}

export const PerformanceSchema = SchemaFactory.createForClass(Performance);
