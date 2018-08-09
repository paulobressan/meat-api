import * as restify from 'restify';
//o modulo padrão do node, ele disponibiliza metodos de emitir eventos
import { EventEmitter } from 'events';

//Essa classe abstrata é criada para tornar pai das rotas e para que no arquivo server podemos
//criar um for e percorrer cada rota declarando-a
export abstract class Router extends EventEmitter {
    //metodo utilizado para abstrair as aplicação de rotas no server.ts
    abstract applyRoutes(application: restify.Server);

    //metodo responsavel por centralizar os retorno do end-point
    render(response: restify.Response, next: restify.Next) {
        return (document) => {
            if (document)
            {
                //Quando formos retornar os dados para o cliente e queremos criar uma formatação, por exemplo
                //retirar campos para não exibir para o cliente, temos que escutar um evento antes de retornar
                //portanto é emitido nessa função e quem chamou escuta o evento
                this.emit('beforeRender', document);
                response.json(document);
            }
            else
                response.send(404);
            return next();
        }
    }
}