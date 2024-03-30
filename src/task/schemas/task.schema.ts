import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { User } from "../../auth/schemas/user.schema";

@Schema({
    timestamps: true,
})

export class Task {

    @Prop()
    title : string;

    @Prop()
    description: string;
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: string;
    // user: User;

    @Prop()
    image: string;

} 


export const TaskSchema = SchemaFactory.createForClass(Task)
