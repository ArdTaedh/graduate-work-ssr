import { hashSync } from 'bcryptjs'
import {Roles} from "./src/models/User";

export const dummyData = {
    users: [
        {
            email: 'admin@example.com',
            password: hashSync('admin1234', 8),
            role: Roles.Admin
        },
        {
            email: 'user@example.com',
            password: hashSync('user1234', 8),
            role: Roles.User
        },
    ],
}