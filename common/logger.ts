//Biblioteca nativa para logs
import * as bunyan from 'bunyan'
import { environment } from './environment';

//constante para configurar os logger
export const logger = bunyan.createLogger({
    //nome dos logger
    name: environment.log.name,
    //level que queremos usar nos logger(INFO, ERROR, FATAL)
    //o level recebe uma prop do level localizada no objeto bunyan, portanto, estamos usando
    //uma string para definir o level dos logs e para isso temos que usar o recurso resolve para 
    //a seleção do level atraves de uma string
    level: (<any>bunyan).resolveLevel(environment.log.level)
})