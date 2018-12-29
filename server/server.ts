//importando o restify para criar o servidor
import * as restify from 'restify';
//importando as configurações estaticas
import { environment } from '../common/environment';
//importando classe abstrata de rotas
import { Router } from '../common/router';
//importando o mongoose
import * as mongoose from 'mongoose';
//importando função de conversão do tipo do metodo patch
import { mergePatchBodyParser } from './merge-patch.parser';
//arquivo de erro
import { handleError } from './error.handler';
//Handler para decodificar token e aplica lo na requisição
import { tokenParser } from '../security/token.parser';
//Manipulador de arquivo do node (File System)
import * as fs from 'fs';
import { logger } from '../common/logger';

//Configurando classe que vai iniciar o servidor
export class Server {

    //metodo que inicializa a conexão com mongo
    initializeDb(): Promise<any> {
        //O mongo tem que ser configurado a forma assincrona que vai ser utilizado, como primisse
        (<any>mongoose).Promise = global.Promise;
        //criando conexão com o mongo pegando a url statica no environment
        return mongoose.connect(environment.db.url, {
            //Usar persistencia atualizada mongoose
            useNewUrlParser: true,
            //Indexar subdocumentos de coleções que tem sub documentos
            useCreateIndex: true,
            //Remover suporte a metodos descontinuada da aplicação no mongoose
            useFindAndModify: false,
        })
    }

    //propriedade que vai armazenar o servidor de aplicação, com ela podemso acessar o servidor em outras classe
    application: restify.Server

    //metodo que vai iniciar o servidor
    initRoutes(routers: Router[]): Promise<any> {
        //Retornando uma promessa que o servidor vai ser iniciado
        return new Promise((resolve, reject) => {
            try {
                //Opções para inicializar o servidor. É o objeto que a função createServer recebe
                const options: restify.ServerOptions = {
                    name: 'meat-api',
                    version: '1.0.0',
                    log: logger
                }

                //Se a certificação estiver ativa na environment, vamos adicionar na options
                if (environment.security.enableHTTPS) {
                    //Configurando um certificado https para testes
                    //o cert.pem é o certificado
                    options.certificate = fs.readFileSync(environment.security.certificate);
                    //key.pem é a chave de validação do certificado
                    options.key = fs.readFileSync(environment.security.key);
                }

                //Configurando o servidor, configurações de criação do servidor
                this.application = restify.createServer(options);

                //request log, configurar log na requisição
                //Toda vez que uma requisição for realizada, o requestLogger vai preparar o log do id dessa requisição para que os logs gerado por nós no código seja idenficado com o id da request
                this.application.pre(restify.plugins.requestLogger({
                    log: logger
                }))

                //Configurando um plugin para capturar os valores passado na url
                this.application.use(restify.plugins.queryParser())

                //Configurando um plugin para converter o body em objetos json
                this.application.use(restify.plugins.bodyParser())

                //Usando a função de conversão de merge-patch+json criada e importada 
                this.application.use(mergePatchBodyParser)

                //Associando o tokenParser a todas requisições
                //Toda requisição que for feita, vai passar pelo tokenParser que por sua vez vai pegar
                //o header da requisição capturar o authorization e decodificar o token, em nenhum momento travamos a requisição
                //Por que podemos ter rotas que não vai precisar do token
                this.application.use(tokenParser)

                //Adicionando arquivos de rotas
                //percorrendo o array de rotas recebido pelo bootstrap e passada para o initRoutes
                //aplica-las na aplicação, as rotas herda de Route que é abstrata e tem o metodo abstrato applyRoute
                //que é subscrito pelas rotas filhas, temos que passar a aplicação para que a rota filha possa criar suas
                //rotas e aqui no initRoute definirmos elas.
                for (let router of routers) {
                    router.applyRoutes(this.application)
                }

                //Esctuando o servidor na porta 3000
                this.application.listen(environment.server.port, () => {
                    //se tudoder certo a promisse retorna o servidor pronto e configurado.
                    resolve(this.application)
                });

                //criando um evento para que ele fique escutando os erros da aplicação se houver vai ser chamado o callback handleErro criado para retornar um json
                this.application.on('restifyError', handleError)


                //LOGS DE AUDITORIA
                //Para verificar se houve error ao escutar o servidor em algumar porta, é necessario se inscrever no servidor
                //e criar um evento de error para escutar se houver algum erro
                // this.application.on('error', (err)=>{
                //     console.log(err);
                // })

                //Configurando o audit logger
                //Temos que tomar o cuidado com os logs de audit por conta que ele gera logs com dados sensiveis
                // this.application.on('after', restify.plugins.auditLogger({
                //     //Qual ferramenta que vamos usar para logar os logs audit
                //     log: logger,
                //     //Em qual momento vamos logar esse log
                //     event: 'after',
                //     //podemos logar tambem o body da requisição
                //     body: true
                // }))

                // //Temos o evento audit que nele recebemos todos os dados para fazer o que quisermos
                // this.application.on('audit', data => {
                //     console.log(data)
                // })
            } catch (error) {
                reject(error)
            }
        })
    }

    //criando um metodo que vai executar o servidor e retornar uma promessa que se tudo der certo
    //retornara uma referencia da classe Server
    bootstrap(routers: Router[] = []): Promise<Server> {
        //iniciar rotas e servidor se a conexão com o banco for sucedida
        return this.initializeDb().then(() =>
            this.initRoutes(routers).then(() => this))
    }

    //Fechar o servidor e fechar a conexão com o banco
    shutdown() {
        return mongoose.disconnect().then(() => this.application.close())
    }
}