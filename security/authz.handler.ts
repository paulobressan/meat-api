import * as restify from 'restify'
import { ForbiddenError } from 'restify-errors'

//Função responsavel por autozirar um usuário, vamos receber os perfil que uma requisição pode aceitar
//Retornar um restifyHandler
//O tipo de retorno é (...profiles: string[]) => restify.RequestHandler = (...profiles), ou seja
//Vamos retornar uma uma função que recebe os profiles e que retorne um restify.RequestHandler
export const authorize: (...profiles: string[]) => restify.RequestHandler = (...profiles) => {
    return (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        //Se conter o usuario estiver autenticado e se encontrar pelo menos um profile
        if (req.authenticated !== undefined && req.authenticated.hasAny(...profiles)) {
            //Vamos permitir o consumo do recurso
            next()
        } else {
            //Se não vamos retornar um erro 
            next(new ForbiddenError("Permission denied"))
        }
    }
}