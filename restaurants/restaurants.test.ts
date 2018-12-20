import 'jest'
import * as request from 'supertest'

const address: string = (<any>global).address
const auth: string = (<any>global).auth

test('get /restaurants', () => {
    return request(address)
        .get('/restaurants')
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
        }).catch(fail)
})

test('post /restaurants', () => {
    return request(address)
        .post('/restaurants')
        .set('Authorization', auth)
        .send({
            name: 'Restaurants Teste'
        })
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe('Restaurants Teste')
        }).catch(fail)
})

test('patch /restaurants', () => {
    return request(address)
        .post('/restaurants')
        .set('Authorization', auth)
        .send({
            name: 'Restaurants Teste'
        })
        .then(response =>
            request(address)
                .patch(`/restaurants/${response.body._id}`)
                .set('Authorization', auth)
                .send({
                    name: 'Restaurants Teste 2'
                }))
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe('Restaurants Teste 2')
        })
})

test('patch /restaurants menu', () => {
    return request(address)
        .post('/restaurants')
        .set('Authorization', auth)
        .send({
            name: 'Restaurants Teste'
        })
        .then(response =>
            request(address)
                .put(`/restaurants/${response.body._id}/menu`)
                .set('Authorization', auth)
                .send({
                    name: 'X-TUDO',
                    price: 20
                }))
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.menu).toBeInstanceOf(Array)
            expect(response.body.menu[0].name).toBe('X-TUDO')
            expect(response.body.menu[0].price).toBe(20)
        })
})