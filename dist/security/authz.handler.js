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
            //Vamos permitir o consumo do recurso
            next();
        }
        else {
            //Se não vamos retornar um erro 
            next(new restify_errors_1.ForbiddenError("Permission denied"));
        }
    };
};
//# sourceMappingURL=authz.handler.js.map