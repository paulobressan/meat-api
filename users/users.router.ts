import * as restify from 'restify';
import { Router } from '../common/router';
//importando o model de usuarios
import { User } from '../users/users.model';

//classe que define rotas de usuarios
class UsersRouter extends Router {
    applyRoutes(application: restify.Server) {
        application.get('/users', (req, resp, next) => {
            User.find().then(users => {
                resp.json(users);
                return next();
            })
        });

        application.get('/users/:id', (req, resp, next) => {
            User.findById(req.params.id).then(user => {
                if (user) {
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

        application.get('/users/byName/:name', (req, resp, next) => {
            User.find({ name: req.params.name }).then(user => {
                if (user) {
                    resp.json(user);
                    return next();
                }
                resp.json(404);
                return next();
            })
        });

        //realizando um put
        //o id do documento é imutavel depois de ser criado, porem podemos definir o id antes de ser criado
        application.put('/users/:id', (req, resp, next) => {
            const options = { overwrite: true }
            //por padrão o update sempre altera os dados parcialmente e no caso abaixo
            //queremos alterar todas prop do documento com as prop do body recebida
            User.update({ _id: req.params.id }, req.body, options)
                //o update retorna uma query e temos que executar essa query para poder aplicar a promisse
                .exec()
                .then(result => {
                    //Se o documento foi subscrevido
                    if (result.n) {
                        //Se o documento foi alterado, vamos retornar o documento alterado
                        return User.findById(req.params.id);
                    } else {
                        //Se não aplicar a alteração no documento é porque o documento não existe.
                        resp.send(404);
                    }
                })
                .then(user => {
                    resp.json(user);
                    return next();
                })

        });

        //O tipo de dados enviado para o patch tem que ser merge- seguindo as boas praticas. Para isso 
        //o patch vai alterar somente a prop que enviarmos para ele. Ele é melhor que o put no caso de
        //alteração de um unico valor ou poucos valores porque não temos que forçar o client pegar o objeto atualizado
        //e enviar.
        application.patch('/users/:id',  (req, resp, next) =>{
            //O findByIdUpdate retorna na promise o documento desatualizado e por isso temos que
            //criar uma options que retornara o documento atualizado
            const options = {
                new: true
            }
            //alterando parcialmente um documento, no put foi feito manualmente a atualização do 
            //documento, o findByIdAndUpdate é uma forma mais produtiva onde ele ja busca o documento
            // que vai ser alterado
            User.findByIdAndUpdate(req.params.id, req.body, options).then(user => {
                if(user){
                    resp.json(user);
                    return next();
                }
                resp.send(404);
                return next();
            })
        });
    }
}

//quem chamar essa classe vai receber uma instancia pronta para utilizar
export const usersRouters = new UsersRouter();