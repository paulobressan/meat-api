import * as restify from 'restify';
import {Router} from '../common/router';
//importando o model de usuarios
import {User} from '../users/users.model';

//classe que define rotas de usuarios
class UsersRouter extends Router{
    applyRoutes(application: restify.Server){
        application.get('/users', (req,resp, next)=>{
            User.findAll().then(users => {
                resp.json(users);
                return next();
            })
        });
    }
}

//quem chamar essa classe vai receber uma instancia pronta para utilizar
export const usersRouters = new UsersRouter();