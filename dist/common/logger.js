"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Biblioteca nativa para logs
const bunyan = require("bunyan");
const environment_1 = require("./environment");
//constante para configurar os logger
exports.logger = bunyan.createLogger({
    //nome dos logger
    name: environment_1.environment.log.name,
    //level que queremos usar nos logger(INFO, ERROR, FATAL)
    //o level recebe uma prop do level localizada no objeto bunyan, portanto, estamos usando
    //uma string para definir o level dos logs e para isso temos que usar o recurso resolve para 
    //a seleção do level atraves de uma string
    level: bunyan.resolveLevel(environment_1.environment.log.level)
});
//# sourceMappingURL=logger.js.map