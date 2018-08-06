"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../common/router");
//importando o model de usuarios
const users_model_1 = require("../users/users.model");
//classe que define rotas de usuarios
class UsersRouter extends router_1.Router {
    applyRoutes(application) {
        application.get('/users', (req, resp, next) => {
            users_model_1.User.find().then(users => {
                resp.json(users);
                return next();
            });
        });
        application.get('/users/:id', (req, resp, next) => {
            users_model_1.User.findById(req.params.id).then(user => {
                if (user) {
                    resp.json(user);
                    return next();
                }
                resp.send(404);
                return next();
            });
        });
        //criando um usuário via post
        application.post('/users', (req, resp, next) => {
            //Criando um novo documento do schema de User
            //podemos passar direto o req.body desque estamos utilizando o plugin body parser
            let user = new users_model_1.User(req.body);
            user.save().then(user => {
                resp.json(user);
                return next();
            });
        });
    }
}
//quem chamar essa classe vai receber uma instancia pronta para utilizar
exports.usersRouters = new UsersRouter();
