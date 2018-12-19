"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_errors_1 = require("restify-errors");
//Função para validar a alteração dos dados de usuário
//Para alterar os dados do usuário com a permissão user, o usuário pode alterar somente os seus dados
//e essa função vai validar se ele esta tentando alterar somente os seus dados
exports.validateUserId = () => (req, resp, next) => {
    let id = req.params.id;
    if (id)
        //Se for qualquer usuário sem ser o admin
        //vamos validar que ele somente possa alterar os seus dados de usuario
        if (req.authenticated.id == id || req.authenticated.profiles.indexOf('admin') !== -1)
            next();
        else
            next(new restify_errors_1.ForbiddenError("Permission denied"));
    next();
};
//# sourceMappingURL=validate-user-id.handler.js.map