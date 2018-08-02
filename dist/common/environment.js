"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Arquivo de configurações default
exports.environment = {
    //configuração do servidor, a porta que vai rodar, pegar a variavel de ambiente ou 3000
    server: { port: process.env.SERVER_PORT || 3000 }
};
