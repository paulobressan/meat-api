"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const model_router_1 = require("../common/model-router");
//importando o model de usuarios
const users_model_1 = require("../users/users.model");
//Arquivo de autenticação
const auth_handler_1 = require("../security/auth.handler");
const authz_handler_1 = require("../security/authz.handler");
const validate_user_id_handler_1 = require("../security/validate-user-id.handler");
//classe que define rotas de usuarios
//extende para ModelRouter que abstrai os acesso ao banco de dados escolhendo o tipo da classe.
class UsersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(users_model_1.User);
        //metodo para a segunda versão de busca de usuário
        this.findByEmail = (req, resp, next) => {
            //Se foi passado o email
            if (req.query.email) {
                users_model_1.User.findByEmail(req.query.email)
                    //Como o render comun retorna notfound se não encontrar, vamos converter para um array o resultado
                    //para usar o renderAll
                    .then(user => {
                    //Se encontrar objeto, retorna o objeto, senão retorna uma lista vazia
                    if (user)
                        return [user];
                    return [];
                })
                    .then(this.renderAll(resp, next, {
                    pageSize: this.pageSize,
                    url: req.url
                }))
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
        //No Model Router, foi criado o basePath que captura o nome da coleção de modelos e atribui para as rotas
        //Assim a rota tera o nome do modelo que esta no banco.
        //this.basePath
        //buscar todos usuários
        //Versionando a rota de busca de usuário.
        //o cliente tem que informar a versão ou o restify vai pegar a mais atual
        application.get(`${this.basePath}`, restify.plugins.conditionalHandler([
            { version: '1.0.0', handler: [authz_handler_1.authorize('admin'), this.findAll] },
            //A função AUTHORIZE fornece que perfil de usuario pode acessar esse recurso
            //Se o usuário não estiver logado ou não tiver a permissão, sera retornado
            //Permission denied
            { version: '2.0.0', handler: [authz_handler_1.authorize('admin'), this.findByEmail, this.findAll] }
        ]));
        //Todo metodo pode conter mais de um callback, para que o mongoose suporte, temos que adicionar um array de callback
        //Somente utilizar o validate id onde tem como parametro o id
        application.get(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.findById]);
        //criando um usuário via post
        application.post(`${this.basePath}`, this.save);
        //realizando um put
        //o id do documento é imutavel depois de ser criado, porem podemos definir o id antes de ser criado
        application.put(`${this.basePath}/:id`, [authz_handler_1.authorize('admin', 'user'), validate_user_id_handler_1.validateUserId(), this.validateId, this.replace]);
        //O tipo de dados enviado para o patch tem que ser merge- seguindo as boas praticas. Para isso 
        //o patch vai alterar somente a prop que enviarmos para ele. Ele é melhor que o put no caso de
        //alteração de um unico valor ou poucos valores porque não temos que forçar o client pegar o objeto atualizado
        //e enviar.
        application.patch(`${this.basePath}/:id`, [authz_handler_1.authorize('admin', 'user'), validate_user_id_handler_1.validateUserId(), this.validateId, this.update]);
        application.del(`${this.basePath}/:id`, [authz_handler_1.authorize('admin'), this.validateId, this.delete]);
        //Rota para o usuário se autenticar
        application.post(`${this.basePath}/authenticate`, auth_handler_1.authenticate);
    }
}
//quem chamar essa classe vai receber uma instancia pronta para utilizar
exports.usersRouters = new UsersRouter();
//# sourceMappingURL=users.router.js.map