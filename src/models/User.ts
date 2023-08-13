import {model, Schema} from "mongoose";

export enum Roles {
    Admin = 'admin',
    User = 'user'
}

interface IUser {
    email: string;
    password: string;
    role: Roles
}

const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: Roles.User, required: true }
})

export const User = model<IUser>('User', userSchema)