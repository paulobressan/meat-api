import * as restify from 'restify';
import { ModelRouter } from '../common/model-router';
//importando o model de usuarios
import { User } from '../users/users.model';
//gerenciado de erros do restify
import { NotFoundError } from 'restify-errors';

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

    applyRoutes(application: restify.Server) {
        //buscar todos usuários
        application.get('/users', this.findAll);
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
export const usersRouters = new UsersRouter();