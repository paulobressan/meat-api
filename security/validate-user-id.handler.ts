import * as restify from 'restify'
import { ForbiddenError } from 'restify-errors'
import { User } from '../users/users.model';

//Função para validar a alteração dos dados de usuário
//Para alterar os dados do usuário com a permissão user, o usuário pode alterar somente os seus dados
//e essa função vai validar se ele esta tentando alterar somente os seus dados
export const validateUserId: () => restify.RequestHandler = () => (req: restify.Request, resp: restify.Response, next: restify.Next) => {
    let id = req.params.id;
    if (id)
        //Se for qualquer usuário sem ser o admin
        //vamos validar que ele somente possa alterar os seus dados de usuario
        if (req.authenticated.id == id || req.authenticated.profiles.indexOf('admin') !== -1)
            next()
        else
            next(new ForbiddenError("Permission denied"))
    next()
}