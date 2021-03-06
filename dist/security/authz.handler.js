"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_errors_1 = require("restify-errors");
//Função responsavel por autozirar um usuário, vamos receber os perfil que uma requisição pode aceitar
//Retornar um restifyHandler
//O tipo de retorno é (...profiles: string[]) => restify.RequestHandler = (...profiles), ou seja
//Vamos retornar uma uma função que recebe os profiles e que retorne um restify.RequestHandler
exports.authorize = (...profiles) => {
    return (req, resp, next) => {
        //Se conter o usuario estiver autenticado e se encontrar pelo menos um profile
        if (req.authenticated !== undefined && req.authenticated.hasAny(...profiles)) {
            //Gerar log se o usuário for autenticado
            req.log.debug('User %s is authorized with profiles %j on route %s. Required profiles: %j', req.authenticated._id, profiles, req.authenticated.profiles, req.path(), profiles);
            //Vamos permitir o consumo do recurso
            next();
        }
        else {
            //Se o usuário realmente não esta autenticado, vamos gerar o log
            if (req.authenticated)
                //gerar log para informar que o usuário não tem permissão para acessar esse modulo
                //%s = vai entrar um parametro string
                //%j = vai entrar um parametro json
                req.log.debug('Permission denied for %s. Required profiles: %j. User profiles: %j', req.authenticated._id, profiles, req.authenticated.profiles);
            //Se não vamos retornar um erro 
            next(new restify_errors_1.ForbiddenError("Permission denied"));
        }
    };
};
//# sourceMappingURL=authz.handler.js.map