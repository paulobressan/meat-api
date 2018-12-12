import 'jest'
//pacote de teste para realizar requisições
import * as request from 'supertest'
import { environment } from '../common/environment'
import { Server } from '../server/server'
import { usersRouters } from '../users/users.router';
import { User } from './users.model';

//Caminho do servidor
let address: string = (<any>global).address

//Para realizar os teste em uma base de homologação, temos que configurar uma instancia especial para isso
//O beforeAll faz isso antes que tudo aconteça
//vamos criar um novo servidor de test e um novo banco
// let server: Server
// beforeAll(() => {
//     //alterando a url na execução do teste para a nova url de test
//     environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db'
//     environment.server.port = process.env.SERVER_PORT || 3001

//     //definindo o caminho do servidor
//     address = `http://localhost:${environment.server.port}`

//     server = new Server()

//     //Como estamos trabalhando com promisse e ela é assincrona, temos que retorna-la para que
//     //a aplicação espere o servidor terminar e continuar a testar
//     return server.bootstrap([usersRouters])
//         //Como é uma base de teste, temos que iniciar ela limpa para não gerar erros
//         .then(() => User.deleteMany({}).exec())
//         //Se der algum erro, vamos logar esse erro
//         .catch(console.error)
// })

//configurando o teste com Jest, o nome e a logica do test
//testando um get em users
test('get /users', () => {
    //usando o supertest para testar requisições

    //Realizando uma requisição get para testarmos
    return request(/**URL da aplicação de teste definida no beforeAll*/address)
        .get(/**Recurso da aplicação que dever ser testado*/'/users')
        .then(response => {
            //regra de negocio do test

            //o expect é um facilitador de comparação do jest, ele vai comparar valores que desejamos
            //por exemplo é comparar se a API restornou 200
            expect(response.status).toBe(200)
            //Testando se retorna a prop items e se ela é um Array
            expect(response.body.items).toBeInstanceOf(Array)
        })
        //se o teste falhar, o erro sera passado para a função fail que é uma função global
        .catch(fail)

})

//testando o metodo post em users
test('post /users', () => {
    //usando o supertest para testar requisições

    //Realizando uma requisição get para testarmos
    return request(/**URL da aplicação de teste definida no beforeAll*/address)
        .post(/**Recurso da aplicação que dever ser testado*/'/users')
        //Enviando um objeto para a inserção
        .send({
            name: 'usuario teste',
            email: 'usuarioteste@email.com',
            password: '123456',
            cpf: '505.025.080-35'
        })
        .then(response => {
            //regra de negocio do test

            //o expect é um facilitador de comparação do jest, ele vai comparar valores que desejamos
            //por exemplo é comparar se a API restornou 200
            expect(response.status).toBe(200)
            //sempre que é inserido é retornado o _id, então vamos testar se existe um id
            expect(response.body._id).toBeDefined()
            //Testando se os valores inserido é o mesmo retornado
            expect(response.body.name).toBe('usuario teste')
            expect(response.body.email).toBe('usuarioteste@email.com')
            expect(response.body.cpf).toBe('505.025.080-35')
            //o password não deve ser retornado, então ele deve retornar undefined
            expect(response.body.password).toBeUndefined()
        })
        //se o teste falhar, o erro sera passado para a função fail que é uma função global
        .catch(fail)
})

//Testando o get de um usuário por id, sendo que vamos passar um id invalido e tem que ser retornado 404 e não erro
test('get /users/aaaaa - not found', () => {
    return request(address)
        //passando no conteudo um id invalido
        .get('/users/aaaaa')
        .then(response => {
            expect(response.status).toBe(404)
        })
        .catch(fail)
})

//Testando o metodo patch onde temos que inserir um registro com o metodo post e logo em seguido alterar com o metodo patch
//É feito isso porque toda vez que é executado o teste, é limpado a base e quando é inserido no post não salvamos o _id em tempo de execução
//portanto temos que inserir e altera-lo logo em seguida.
test('patch /users/:id', () => {
    return request(/**URL da aplicação de teste definida no beforeAll*/address)
        .post(/**Recurso da aplicação que dever ser testado*/'/users')
        //Enviando um objeto para a inserção
        .send({
            name: 'usuario2 teste',
            email: 'usuario2@email.com',
            password: '123456'
        })
        //Vamos encadear as promisse para que seja inserido e retorne uma promisse de alteração do PATCH
        .then(response => request(address)
            .patch(`/users/${response.body._id}`)
            .send({
                name: 'usuario2 - patch'
            }))
        //Tratar a promisse do retorno da primeira promisse. Essa segunda promisse é responsavel pelo PATCH
        .then(response => {
            //o expect é um facilitador de comparação do jest, ele vai comparar valores que desejamos
            //por exemplo é comparar se a API restornou 200
            expect(response.status).toBe(200)
            //sempre que é inserido é retornado o _id, então vamos testar se existe um id
            expect(response.body._id).toBeDefined()
            //Testando se os valores inserido é o mesmo retornado
            expect(response.body.name).toBe('usuario2 - patch')
            //o password não deve ser retornado, então ele deve retornar undefined
            expect(response.body.password).toBeUndefined()
        })
        //se o teste falhar, o erro sera passado para a função fail que é uma função global
        .catch(fail)
})

// //Depois de tudo vamos desligar o servidor
// afterAll(() => {
//     server.shutdown()
// })