import * as restify from 'restify';

//Essa classe abstrata é criada para tornar pai das rotas e para que no arquivo server podemos
//criar um for e percorrer cada rota declarando-a
export abstract class Router{
    abstract applyRoutes(application: restify.Server)
}