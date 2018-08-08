"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//criando um arquivo para utilizar um novo formato aceito de requisição
// no caso vai ser utilizado no patch, quando o cliente for enviar a requisição ele tem que enviar com
//o content type application/merge-patch+json
const mpContentType = 'application/merge-patch+json';
exports.mergePatchBodyParser = (req, resp, next) => {
    //Como essa função vai ser utilizada no servidor inteiro, temos que especificar que vamos aplicar
    //somente nos metodo patch
    if (req.getContentType() === mpContentType && req.method === "PATCH") {
        //se quisermos utilizar o body antes de ser convertido, podemos guarda-lo em outra prop
        // (<any>req).rawBody = req.body;
        //se for verdadeiro, vamos atribuir ao body o proprio body convertido em json
        try {
            req.body = JSON.parse(req.body);
        }
        catch (e) {
            return next(new Error(`Invalid content. ${e}`));
        }
    }
};
