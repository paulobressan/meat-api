"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_errors_1 = require("restify-errors");
//gerenciamento do jwt
const jwt = require("jsonwebtoken");
const users_model_1 = require("../users/users.model");
const environment_1 = require("../common/environment");
//Função de autenticação
exports.authenticate = (req, resp, next) => {
    //Criar objeto dinamico e mapear o body de acordo com as prop do objeto dinamico
    const { email, password } = req.body;
    //O findByEmail não retorna o password, no model user foi configurado o select: false
    //Portanto não sera retornado o password em nenhuma busca, para isso o metodo usado findByEmail no userModel
    //o findOne é quem ele utiliza passando o email como parametro para a busca, porem ele recebe uma projection
    //Onde podemos definir campos que queremos que retorne e que esta configurado para não retornar
    users_model_1.User.findByEmail(email, '+password')
        .then(user => {
        //matches é um metodo para comparar o password passado com o do usuário persistido
        if (user && user.matches(password)) {
            //gerar token JWT
            //Gerar o token com o jsonwebtoken
            const token = jwt.sign({ sub: user.email, iss: 'meat-api' }, environment_1.environment.security.apiSecret);
            //retornar um objeto com algumas informações e o token gerado
            resp.json({ name: user.name, email: user.email, accessToken: token });
            //retornando o token e encerrando o processo
            return next(false);
        }
        else {
            return next(new restify_errors_1.NotAuthorizedError('Invalid Credentials'));
        }
    }).catch(next);
};
//# sourceMappingURL=auth.handler.js.map