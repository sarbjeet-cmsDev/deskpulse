import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

export type WorkSpaceDocument = WorkSpace & Document;

@Schema({ timestamps: true })
export class WorkSpace {
    @Prop({ required: true })
    title: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
    user: MongooseSchema.Types.ObjectId;

    @Prop({ type: Number, required: false, default: 1 })
    status: number;

    @Prop({
        type: [
            {
                user: { type: MongooseSchema.Types.ObjectId, ref: "User" },
                role: { type: String },
                username: { type: String },
                firstName: { type: String },
                lastName: { type: String },
            },
        ],
    })
    members: {
        user: MongooseSchema.Types.ObjectId;
        role: String;
        username: String;
        firstName: String;
        lastName: String;
    }[];

    @Prop({ type: String, required: false })
    role: { user: MongooseSchema.Types.ObjectId }[];
}

export const WorkSpaceSchema = SchemaFactory.createForClass(WorkSpace);
