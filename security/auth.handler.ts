import * as restify from 'restify'
import { NotAuthorizedError } from 'restify-errors'
//gerenciamento do jwt
import * as jwt from 'jsonwebtoken'
import { User } from '../users/users.model'
import { environment } from '../common/environment';

//Função de autenticação
export const authenticate: restify.RequestHandler = (req: restify.Request, resp: restify.Response, next: restify.Next) => {
    //Criar objeto dinamico e mapear o body de acordo com as prop do objeto dinamico
    const { email, password } = req.body

    //O findByEmail não retorna o password, no model user foi configurado o select: false
    //Portanto não sera retornado o password em nenhuma busca, para isso o metodo usado findByEmail no userModel
    //o findOne é quem ele utiliza passando o email como parametro para a busca, porem ele recebe uma projection
    //Onde podemos definir campos que queremos que retorne e que esta configurado para não retornar
    User.findByEmail(email, '+password')
        .then(user => {
            //matches é um metodo para comparar o password passado com o do usuário persistido
            if (user && user.matches(password)) {
                //gerar token JWT
                //Gerar o token com o jsonwebtoken
                const token = jwt.sign({ sub: user.email, iss: 'meat-api' }, environment.security.apiSecret)
                //retornar um objeto com algumas informações e o token gerado
                resp.json({ name: user.name, email: user.email, accessToken: token })
                //retornando o token e encerrando o processo
                return next(false);
            } else {
                return next(new NotAuthorizedError('Invalid Credentials'))
            }
        }).catch(next)
}