import * as restify from 'restify';
//o modulo padrão do node, ele disponibiliza metodos de emitir eventos
import { EventEmitter } from 'events';
//gerenciado de erros do restify
import { NotFoundError } from 'restify-errors';

//Essa classe abstrata é criada para tornar pai das rotas e para que no arquivo server podemos
//criar um for e percorrer cada rota declarando-a
export abstract class Router extends EventEmitter {
    //metodo utilizado para abstrair as aplicação de rotas no server.ts
    abstract applyRoutes(application: restify.Server);

    //criado para pegar os dados do documento e adicionar mais dados no documento
    envelope(document: any){
        return document;
    }

    //metodo responsavel por centralizar os retorno do end-point
    render(response: restify.Response, next: restify.Next) {
        return (document) => {
            if (document)
            {
                //Quando formos retornar os dados para o cliente e queremos criar uma formatação, por exemplo
                //retirar campos para não exibir para o cliente, temos que escutar um evento antes de retornar
                //portanto é emitido nessa função e quem chamou escuta o evento
                this.emit('beforeRender', document);
                response.json(this.envelope(document));
            }
            else
                throw new NotFoundError('Documento não encontrado');
            return next();
        }
    }

    //O render all é especifico para retornar listas. O render não suporta retornar listas, 
    //portanto temos que criar um novo metodo que trate retorno de lista.
    renderAll(response: restify.Response, next: restify.Next){
        return (documents: any[]) => {
            if(documents){
                documents.forEach((document, index, array) => {
                    this.emit('beforeRender', document);
                    //Para cada documento vamos envelopar dados auxiliares
                    array[index] = this.envelope(document);
                });
                response.json(documents);
            }else
                response.json([]);   
            return next();        
        }
    }
}