import  mongoose,{Schema}  from 'mongoose';
import Todo from '../Types/todo';
import { IUser } from '../Types/User';
const AutoIncrement = require('mongoose-sequence')(mongoose);


export const databaseschema = new Schema<IUser>({
    UserId:{
        type: Number,
    },
    fullName: {
        type: String,
        required: [true, "cant be empty fullname"],
        maxlength:30
    },
    email: {
        type: String,
        required:[ true,"email should be unique"],
        lowercase: true,
        trim: true,
        unique:true        
    },
    password:{
        type: String,
        required: true,
        minlength:6,
        maxlength:60
    },
    
} ,{ timestamps: { createdAt: 'created_at' } });

export const todoschema = new Schema<Todo>({
    title: {
        type: String,
        required: [true, "please enter title"]
    },
    description: {
        type: String,
        required: [true, "please enter description"]
    },
    userId: {
        type: Number,
        ref: "users",
        required: true
    }

}, { timestamps: { createdAt: 'created_at' } });

databaseschema.plugin(AutoIncrement, {id:'UserId_seq',inc_field: 'UserId'});


export const databasemodel = mongoose.model<IUser>('users', databaseschema);
export const todomodel = mongoose.model<Todo>('todolist', todoschema);