import { User } from './users/users.model'

declare module 'restify' {
    export interface Request {
        authenticated: User
    }
}