"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//o modulo padrão do node, ele disponibiliza metodos de emitir eventos
const events_1 = require("events");
//gerenciado de erros do restify
const restify_errors_1 = require("restify-errors");
//Essa classe abstrata é criada para tornar pai das rotas e para que no arquivo server podemos
//criar um for e percorrer cada rota declarando-a
class Router extends events_1.EventEmitter {
    //criado para pegar os dados do documento e adicionar mais dados no documento
    envelope(document) {
        return document;
    }
    //metodo responsavel por centralizar os retorno do end-point
    render(response, next) {
        return (document) => {
            if (document) {
                //Quando formos retornar os dados para o cliente e queremos criar uma formatação, por exemplo
                //retirar campos para não exibir para o cliente, temos que escutar um evento antes de retornar
                //portanto é emitido nessa função e quem chamou escuta o evento
                this.emit('beforeRender', document);
                response.json(this.envelope(document));
            }
            else
                throw new restify_errors_1.NotFoundError('Documento não encontrado');
            return next();
        };
    }
    //O render all é especifico para retornar listas. O render não suporta retornar listas, 
    //portanto temos que criar um novo metodo que trate retorno de lista.
    renderAll(response, next) {
        return (documents) => {
            if (documents) {
                documents.forEach((document, index, array) => {
                    this.emit('beforeRender', document);
                    //Para cada documento vamos envelopar dados auxiliares
                    array[index] = this.envelope(document);
                });
                response.json(documents);
            }
            else
                response.json([]);
            return next();
        };
    }
}
exports.Router = Router;
//# sourceMappingURL=router.js.map