//
import * as jestCli from 'jest-cli'

import { environment } from "./common/environment"
import { usersRouters } from "./users/users.router"
import { Server } from "./server/server"
import { User } from "./users/users.model"
import { reviewsRouter } from "./reviews/reviews.router"
import { Review } from "./reviews/reviews.model"
import { restaurantRouter } from './restaurants/restaurants.router'
import { Restaurant } from './restaurants/restaurants.model';

//Classe responsavel por definir as configurações globais dos arquivos de testes

//Para realizar os teste em uma base de homologação, temos que configurar uma instancia especial para isso
//O beforeAll faz isso antes que tudo aconteça
//vamos criar um novo servidor de test e um novo banco
let server: Server

const beforeAllTests = () => {
    //alterando a url na execução do teste para a nova url de test
    environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db'
    environment.server.port = process.env.SERVER_PORT || 3001

    server = new Server()

    //Como estamos trabalhando com promisse e ela é assincrona, temos que retorna-la para que
    //a aplicação espere o servidor terminar e continuar a testar
    return server.bootstrap([
        usersRouters,
        reviewsRouter,
        restaurantRouter
    ])
        //Como é uma base de teste, temos que iniciar ela limpa para não gerar erros
        .then(() => User.deleteMany({}).exec())
        //Depois de limpar todos usuários, vamos criar um usuário para a autenticação do token
        .then(() => {
            //O teste é de um usuário que tem todas os profiles, mas podemos testar com varios usuários
            let admin = new User();
            admin.name = 'Admin';
            admin.email = 'admin@email.com';
            admin.password = '123456';
            admin.profiles = ['admin', 'user'];
            return admin.save();
        })
        .then(() => Review.deleteMany({}).exec())
        .then(() => Restaurant.deleteMany({}).exec())
        //Se der algum erro, vamos logar esse erro
        .catch(console.error)
}

//Depois de tudo vamos desligar o servidor
const afterAllTests = () => {
    return server.shutdown()
}

//Esse metodo vai executar a função para inicializar o servidor de teste
//Ela é definida para executar no arquivo package.json na prop scripts no test
beforeAllTests()
    .then(() => jestCli.run())
    .then(() => afterAllTests())
    .catch(console.error)