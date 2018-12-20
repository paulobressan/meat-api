import 'jest'
import * as request from 'supertest'
import { environment } from '../common/environment'

//Caminho do servidor
const address: string = (<any>global).address
const auth: string = (<any>global).auth

//configurando o teste com Jest, o nome e a logica do test
//testando um get em users
test('get /reviews', () => {
    //usando o supertest para testar requisições

    //Realizando uma requisição get para testarmos
    return request(/**URL da aplicação de teste definida no beforeAll*/address)
        .get(/**Recurso da aplicação que dever ser testado*/'/reviews')
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

test('post /reviews', () => {
    return request(address)
        .post(/**Recurso da aplicação que dever ser testado*/'/users')
        //Setando um header de autorização
        .set('Authorization', auth)
        //Enviando um objeto para a inserção
        .send({
            name: 'usuario teste',
            email: 'usuariotestereviews@email.com',
            password: '123456',
            cpf: '505.025.080-35'
        }).then(user => request(address)
            .post('/restaurants')
            .set('Authorization', auth)
            .send({
                name: 'Restaurants Teste'
            })
            .then(restaurant => request(address)
                .post('/reviews')
                .set('Authorization', auth)
                .send({
                    date: new Date(),
                    rating: 5,
                    comments: 'Muito Bom',
                    restaurant: restaurant.body._id,
                    user: user.body._id
                }))
        )
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.rating).toBe(5)
            expect(response.body.comments).toBe('Muito Bom')
        })
        .catch(fail)
})