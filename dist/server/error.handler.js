"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//arquivo que vai interceptar todos erros da aplicação, ele é aplicado no server.ts
exports.handleError = (req, resp, err, done) => {
    //quando houver erro o toJSON é a prop criada para armazenar a mensagem de erro que sera retornada para o client
    //O restify busca uma prop toJSON para tratar o erros nela, portanto vamos subscreve-la
    err.toJSON = () => {
        return {
            menssage: err.message
        };
    };
    //err.statusCode = 400;
    console.log(err.code);
    //tratar erros de suas origens
    switch (err.name) {
        case 'MongoError':
            if (err.code === 11000)
                err.statusCode = 400;
            break;
    }
    done();
};
