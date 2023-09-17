import session from 'express-session';

type User = {
    id: string;
    email: string;
    password: string;
    role: string;
}

declare module 'express-session' {
    export interface SessionData {
        user: User;
    }
}
