"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//importando o restify para criar o servidor
const restify = require("restify");
//importando as configurações estaticas
const environment_1 = require("../common/environment");
//importando o mongoose
const mongoose = require("mongoose");
//Configurando classe que vai iniciar o servidor
class Server {
    //metodo que inicializa a conexão com mongo
    initializeDb() {
        //O mongo tem que ser configurado a forma assincrona que vai ser utilizado, como primisse
        mongoose.Promise = global.Promise;
        //criando conexão com o mongo pegando a url statica no environment
        return mongoose.connect(environment_1.environment.db.url, {
            useMongoClient: true
        });
    }
    //metodo que vai iniciar o servidor
    initRoutes(routers) {
        //Retornando uma promessa que o servidor vai ser iniciado
        return new Promise((resolve, reject) => {
            try {
                //Configurando o servidor, nome e versão
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                });
                //Configurando um plugin para capturar os valores passado na url
                this.application.use(restify.plugins.queryParser());
                //Configurando um plugin para converter o body em objetos json
                this.application.use(restify.plugins.bodyParser());
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
}
exports.Server = Server;
