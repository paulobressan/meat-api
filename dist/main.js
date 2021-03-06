"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
//importando instancias de rotas e passando como parametro para o boostrap do servidor
//nele criamos um roteador que passar por cada rota importada e passada para o bootstrap
//e assim declarando rota por rota
const users_router_1 = require("./users/users.router");
const restaurants_router_1 = require("./restaurants/restaurants.router");
const reviews_router_1 = require("./reviews/reviews.router");
const root_router_1 = require("./root/root.router");
//criando uma instancia de server
const server = new server_1.Server();
//Chamar o boostrap que inicializa o servidor e passamos como parametro as rotas
server.bootstrap([users_router_1.usersRouters, restaurants_router_1.restaurantRouter, reviews_router_1.reviewsRouter, root_router_1.rootRouter]).then(server => {
    //Se tudo der certo, vamos logar no terminar a porta que esta rodando o servidor.
    console.log('Servidor rodando ', server.application.address());
}).catch(err => {
    //Se ocorrer erro, vamos logar que houve erro e o erro
    console.log('Erro no servidor');
    console.log(err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map