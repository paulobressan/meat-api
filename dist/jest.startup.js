"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//
const jestCli = require("jest-cli");
const environment_1 = require("./common/environment");
const users_router_1 = require("./users/users.router");
const server_1 = require("./server/server");
const users_model_1 = require("./users/users.model");
const reviews_router_1 = require("./reviews/reviews.router");
const reviews_model_1 = require("./reviews/reviews.model");
const restaurants_router_1 = require("./restaurants/restaurants.router");
const restaurants_model_1 = require("./restaurants/restaurants.model");
//Classe responsavel por definir as configurações globais dos arquivos de testes
//Para realizar os teste em uma base de homologação, temos que configurar uma instancia especial para isso
//O beforeAll faz isso antes que tudo aconteça
//vamos criar um novo servidor de test e um novo banco
let server;
const beforeAllTests = () => {
    //alterando a url na execução do teste para a nova url de test
    environment_1.environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db';
    environment_1.environment.server.port = process.env.SERVER_PORT || 3001;
    server = new server_1.Server();
    //Como estamos trabalhando com promisse e ela é assincrona, temos que retorna-la para que
    //a aplicação espere o servidor terminar e continuar a testar
    return server.bootstrap([
        users_router_1.usersRouters,
        reviews_router_1.reviewsRouter,
        restaurants_router_1.restaurantRouter
    ])
        //Como é uma base de teste, temos que iniciar ela limpa para não gerar erros
        .then(() => users_model_1.User.deleteMany({}).exec())
        //Depois de limpar todos usuários, vamos criar um usuário para a autenticação do token
        .then(() => {
        //O teste é de um usuário que tem todas os profiles, mas podemos testar com varios usuários
        let admin = new users_model_1.User();
        admin.name = 'Admin';
        admin.email = 'admin@email.com';
        admin.password = '123456';
        admin.profiles = ['admin', 'user'];
        return admin.save();
    })
        .then(() => reviews_model_1.Review.deleteMany({}).exec())
        .then(() => restaurants_model_1.Restaurant.deleteMany({}).exec())
        //Se der algum erro, vamos logar esse erro
        .catch(console.error);
};
//Depois de tudo vamos desligar o servidor
const afterAllTests = () => {
    return server.shutdown();
};
//Esse metodo vai executar a função para inicializar o servidor de teste
//Ela é definida para executar no arquivo package.json na prop scripts no test
beforeAllTests()
    .then(() => jestCli.run())
    .then(() => afterAllTests())
    .catch(console.error);
//# sourceMappingURL=jest.startup.js.map