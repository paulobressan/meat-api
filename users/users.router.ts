import * as restify from 'restify';
import {Router} from '../common/router';
//importando o model de usuarios
import {User} from '../users/users.model';

//classe que define rotas de usuarios
class UsersRouter extends Router{
    applyRoutes(application: restify.Server){
        application.get('/users', (req,resp, next)=>{
            User.find().then(users => {
                resp.json(users);
                return next();
            })
        });

        application.get('/users/:id', (req, resp, next) => {
            User.findById(req.params.id).then(user => {
                if(user){
                    resp.json(user);
                    return next();
                }
                resp.send(404);
                return next();
            })
        });

        //criando um usuário via post
        application.post('/users', (req, resp, next) => {
            //Criando um novo documento do schema de User
            //podemos passar direto o req.body desque estamos utilizando o plugin body parser
            let user = new User(req.body);
            user.save().then(user => {
                resp.json(user);
                return next();
            })
        });
    }
}

//quem chamar essa classe vai receber uma instancia pronta para utilizar
export const usersRouters = new UsersRouter();