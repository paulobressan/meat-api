"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
//importando o model de usuarios
const users_model_1 = require("../users/users.model");
//classe que define rotas de usuarios
//extende para ModelRouter que abstrai os acesso ao banco de dados escolhendo o tipo da classe.
class UsersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(users_model_1.User);
        //metodo para a segunda versão de busca de usuário
        this.findByEmail = (req, resp, next) => {
            //Se foi passado o email
            if (req.query.email) {
                users_model_1.User.find({ email: req.query.email })
                    .then(this.renderAll(resp, next))
                    .catch(next);
            }
            else {
                next();
            }
        };
        //capturando eventos da classe pai antes que o metodo de retorno das rotas
        //retorna os objetos para o cliente, assim podemos manipular o valor antes
        //que ele retorne
        this.on('beforeRender', document => {
            document.password = undefined;
            //temos tambem
            //delete document.password;
        });
    }
    applyRoutes(application) {
        //buscar todos usuários
        //Versionando a rota de busca de usuário.
        //o cliente tem que informar a versão ou o restify vai pegar a mais atual
        application.get({ path: '/users', version: '2.0.0' }, [this.findByEmail, this.findAll]);
        application.get({ path: '/users', version: '1.0.0' }, this.findAll);
        //Todo metodo pode conter mais de um callback, para que o mongoose suporte, temos que adicionar um array de callback
        //Somente utilizar o validate id onde tem como parametro o id
        application.get('/users/:id', [this.validateId, this.findById]);
        //criando um usuário via post
        application.post('/users', this.save);
        //realizando um put
        //o id do documento é imutavel depois de ser criado, porem podemos definir o id antes de ser criado
        application.put('/users/:id', [this.validateId, this.replace]);
        //O tipo de dados enviado para o patch tem que ser merge- seguindo as boas praticas. Para isso 
        //o patch vai alterar somente a prop que enviarmos para ele. Ele é melhor que o put no caso de
        //alteração de um unico valor ou poucos valores porque não temos que forçar o client pegar o objeto atualizado
        //e enviar.
        application.patch('/users/:id', [this.validateId, this.update]);
        application.del('/users/:id', [this.validateId, this.delete]);
    }
}
//quem chamar essa classe vai receber uma instancia pronta para utilizar
exports.usersRouters = new UsersRouter();
//# sourceMappingURL=users.router.js.map