import { User } from './users/users.model'

//No modulo restify, vamos modificar
declare module 'restify' {
    //Na interface Request vamos adicionar uma nova prop
    export interface Request {
        //Nova Prop adicionada do tipo User
        authenticated: User
    }
}