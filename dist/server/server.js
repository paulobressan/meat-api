"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//importando o restify para criar o servidor
const restify = require("restify");
//importando as configurações estaticas
const environment_1 = require("../common/environment");
//importando o mongoose
const mongoose = require("mongoose");
//importando função de conversão do tipo do metodo patch
const merge_patch_parser_1 = require("./merge-patch.parser");
//arquivo de erro
const error_handler_1 = require("./error.handler");
//Handler para decodificar token e aplica lo na requisição
const token_parser_1 = require("../security/token.parser");
//Manipulador de arquivo do node (File System)
const fs = require("fs");
//Configurando classe que vai iniciar o servidor
class Server {
    //metodo que inicializa a conexão com mongo
    initializeDb() {
        //O mongo tem que ser configurado a forma assincrona que vai ser utilizado, como primisse
        mongoose.Promise = global.Promise;
        //criando conexão com o mongo pegando a url statica no environment
        return mongoose.connect(environment_1.environment.db.url, {
            //Usar persistencia atualizada mongoose
            useNewUrlParser: true,
            //Indexar subdocumentos de coleções que tem sub documentos
            useCreateIndex: true,
            //Remover suporte a metodos descontinuada da aplicação no mongoose
            useFindAndModify: false
        });
    }
    //metodo que vai iniciar o servidor
    initRoutes(routers) {
        //Retornando uma promessa que o servidor vai ser iniciado
        return new Promise((resolve, reject) => {
            try {
                //Opções para inicializar o servidor. É o objeto que a função createServer recebe
                const options = {
                    name: 'meat-api',
                    version: '1.0.0'
                };
                //Se a certificação estiver ativa na environment, vamos adicionar na options
                if (environment_1.environment.security.enableHTTPS) {
                    //Configurando um certificado https para testes
                    //o cert.pem é o certificado
                    options.certificate = fs.readFileSync(environment_1.environment.security.certificate);
                    //key.pem é a chave de validação do certificado
                    options.key = fs.readFileSync(environment_1.environment.security.key);
                }
                //Configurando o servidor, configurações de criação do servidor
                this.application = restify.createServer(options);
                //Configurando um plugin para capturar os valores passado na url
                this.application.use(restify.plugins.queryParser());
                //Configurando um plugin para converter o body em objetos json
                this.application.use(restify.plugins.bodyParser());
                //Usando a função de conversão de merge-patch+json criada e importada 
                this.application.use(merge_patch_parser_1.mergePatchBodyParser);
                //Associando o tokenParser a todas requisições
                //Toda requisição que for feita, vai passar pelo tokenParser que por sua vez vai pegar
                //o header da requisição capturar o authorization e decodificar o token, em nenhum momento travamos a requisição
                //Por que podemos ter rotas que não vai precisar do token
                this.application.use(token_parser_1.tokenParser);
                //Adicionando arquivos de rotas
                //percorrendo o array de rotas recebido pelo bootstrap e passada para o initRoutes
                //aplica-las na aplicação, as rotas herda de Route que é abstrata e tem o metodo abstrato applyRoute
                //que é subscrito pelas rotas filhas, temos que passar a aplicação para que a rota filha possa criar suas
                //rotas e aqui no initRoute definirmos elas.
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }
                //Esctuando o servidor na porta 3000
                this.application.listen(environment_1.environment.server.port, () => {
                    //se tudoder certo a promisse retorna o servidor pronto e configurado.
                    resolve(this.application);
                });
                //criando um evento para que ele fique escutando os erros da aplicação se houver vai ser chamado o callback handleErro criado para retornar um json
                this.application.on('restifyError', error_handler_1.handleError);
                //Para verificar se houve error ao escutar o servidor em algumar porta, é necessario se inscrever no servidor
                //e criar um evento de error para escutar se houver algum erro
                // this.application.on('error', (err)=>{
                //     console.log(err);
                // })
            }
            catch (error) {
                reject(error);
            }
        });
    }
    //criando um metodo que vai executar o servidor e retornar uma promessa que se tudo der certo
    //retornara uma referencia da classe Server
    bootstrap(routers = []) {
        //iniciar rotas e servidor se a conexão com o banco for sucedida
        return this.initializeDb().then(() => this.initRoutes(routers).then(() => this));
    }
    //Fechar o servidor e fechar a conexão com o banco
    shutdown() {
        return mongoose.disconnect().then(() => this.application.close());
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map