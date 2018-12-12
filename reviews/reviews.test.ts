import 'jest'
import * as request from 'supertest'
import { environment } from '../common/environment'

//Caminho do servidor
let address: string = (<any>global).address


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
