"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../common/router");
//importando o model de usuarios
const users_model_1 = require("../users/users.model");
//classe que define rotas de usuarios
class UsersRouter extends router_1.Router {
    applyRoutes(application) {
        application.get('/users', (req, resp, next) => {
            users_model_1.User.findAll().then(users => {
                resp.json(users);
                return next();
            });
        });
    }
}
//quem chamar essa classe vai receber uma instancia pronta para utilizar
exports.usersRouters = new UsersRouter();
