import * as restify from 'restify'
//gerenciamento do jwt
import * as jwt from 'jsonwebtoken'
import { User } from '../users/users.model'
import { environment } from '../common/environment';

//decodificar o token
export const tokenParser: restify.RequestHandler = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
    //Extrair o token do cabeçalho da requisição
    const token = extractToken(req)
    //Se existir o token
    if (token) {
        //Verificar o token se ele é valido
        //O applyBearer é um callback vai associar os dados que estão dentro do token com o request
        jwt.verify(token, environment.security.apiSecret, applyBearer(req, next))
    } else {
        next()
    }
}

//Função responsavel por extrair o token do cabeçalho da requisição
function extractToken(req: restify.Request) {
    let token: string = undefined
    //o token vai vim no header com Authorization e o seu portador é o Bearer Authorization: Bearer TOKEN
    const authorization = req.header('authorization')
    if (authorization) {
        //separando o token de seu portado, exemplo Bearer TOKEN, vamos separar em dois array, quebrando a string
        //pelo espaço em branco entre Bearer e TOKEN
        const parts: string[] = authorization.split(' ')
        //Se o array tiver 2 posição e a primeira posição for o portador Bearer, vamos retornar o token que esta
        //na segunda posição [1]
        if (parts.length === 2 && parts[0] === 'Bearer') {
            token = parts[1]
        }
        return token
    }
}

//Função responsavel por associar o token a requisição, ela retornar uma função com o priemiro parametro é erro e o segundo é
//o token decodificado e a função que é retornada tem o seu proprio retorno que é void
function applyBearer(req: restify.Request, next: restify.Next): (error, decoded) => void {
    return (error, decoded) => {
        //Se existir a decodificação do token feita pela função verify do jwt
        if (decoded) {
            //No token decodificado tem os dados que definimos para codificar o token, por exemplo o email que esta na prop sub
            //Portanto podemos usar o email para realizar uma busca do usuário
            User.findByEmail(decoded.sub).then(user => {
                //Se o usuário for encontrado
                if (user) {
                    //Associar o usuário no request
                    req.authenticated = user
                }
                next()
            }).catch(next)
        } else {
            next()
        }
    }
}