import * as restify from 'restify';
import { ModelRouter } from '../common/model-router';
//importando o model de usuarios
import { User } from '../users/users.model';

//classe que define rotas de usuarios
//extende para ModelRouter que abstrai os acesso ao banco de dados escolhendo o tipo da classe.
class UsersRouter extends ModelRouter<User> {
    constructor() {
        super(User)
        //capturando eventos da classe pai antes que o metodo de retorno das rotas
        //retorna os objetos para o cliente, assim podemos manipular o valor antes
        //que ele retorne
        this.on('beforeRender', document => {
            document.password = undefined;
            //temos tambem
            //delete document.password;
        })
    }

    //metodo para a segunda versão de busca de usuário
    findByEmail = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
        //Se foi passado o email
        if (req.query.email) {
            User.findByEmail(req.query.email)
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
                .catch(next)
        } else {
            next();
        }
    }

    applyRoutes(application: restify.Server) {
        //No Model Router, foi criado o basePath que captura o nome da coleção de modelos e atribui para as rotas
        //Assim a rota tera o nome do modelo que esta no banco.
        //this.basePath

        //buscar todos usuários
        //Versionando a rota de busca de usuário.
        //o cliente tem que informar a versão ou o restify vai pegar a mais atual
        application.get(`${this.basePath}`, restify.plugins.conditionalHandler([
            { version: '1.0.0', handler: this.findAll },
            { version: '2.0.0', handler: [this.findByEmail, this.findAll] }
        ]));
        //Todo metodo pode conter mais de um callback, para que o mongoose suporte, temos que adicionar um array de callback
        //Somente utilizar o validate id onde tem como parametro o id
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        //criando um usuário via post
        application.post(`${this.basePath}`, this.save);
        //realizando um put
        //o id do documento é imutavel depois de ser criado, porem podemos definir o id antes de ser criado
        application.put(`${this.basePath}/:id`, [this.validateId, this.replace]);
        //O tipo de dados enviado para o patch tem que ser merge- seguindo as boas praticas. Para isso 
        //o patch vai alterar somente a prop que enviarmos para ele. Ele é melhor que o put no caso de
        //alteração de um unico valor ou poucos valores porque não temos que forçar o client pegar o objeto atualizado
        //e enviar.
        application.patch(`${this.basePath}/:id`, [this.validateId, this.update]);
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete]);
    }
}

//quem chamar essa classe vai receber uma instancia pronta para utilizar
export const usersRouters = new UsersRouter();