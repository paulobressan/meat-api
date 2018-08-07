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
        application.get('/users/byName/:name', (req, resp, next) => {
            users_model_1.User.find({ name: req.params.name }).then(user => {
                if (user) {
                    resp.json(user);
                    return next();
                }
                resp.json(404);
                return next();
            });
        });
        //realizando um put
        //o id do documento é imutavel depois de ser criado, porem podemos definir o id antes de ser criado
        application.put('/users/:id', (req, resp, next) => {
            const options = { overwrite: true };
            //por padrão o update sempre altera os dados parcialmente e no caso abaixo
            //queremos alterar todas prop do documento com as prop do body recebida
            users_model_1.User.update({ _id: req.params.id }, req.body, options)
                //o update retorna uma query e temos que executar essa query para poder aplicar a promisse
                .exec()
                .then(result => {
                //Se o documento foi subscrevido
                if (result.n) {
                    //Se o documento foi alterado, vamos retornar o documento alterado
                    return users_model_1.User.findById(req.params.id);
                }
                else {
                    //Se não aplicar a alteração no documento é porque o documento não existe.
                    resp.send(404);
                }
            })
                .then(user => {
                resp.json(user);
                return next();
            });
        });
    }
}
//quem chamar essa classe vai receber uma instancia pronta para utilizar
exports.usersRouters = new UsersRouter();
