import * as restify from 'restify';

//arquivo que vai interceptar todos erros da aplicação, ele é aplicado no server.ts
export const handleError = (req: restify.Request, resp: restify.Response, err, done) => {
    //quando houver erro o toJSON é a prop criada para armazenar a mensagem de erro que sera retornada para o client
    //O restify busca uma prop toJSON para tratar o erros nela, portanto vamos subscreve-la
    err.toJSON = () => {
        return {
            menssage: err.message,
            statusCode: err.statusCode
        }
    }
    //err.statusCode = 400;
    console.log(err);

    //tratar erros de suas origens
    switch (err.name) {
        case 'MongoError':
            if (err.code === 11000)
                err.statusCode = 400;
            break;
        //erro de validações do mongoose
        case 'ValidationError':
            err.statusCode = 400;
            //Se for erro de validações, vamos criar um array de mensagem e retornar para o cliente
            //Para cada mensagem de validação, vamos colocar em um array
            const messages: any[] = [];
            for (let name in err.errors) {
                messages.push({ message: err.errors[name].message })
            }

            //substituir o toJSON para retornar a lista de erros
            err.toJSON = () => ({
                //mensagem de erro que pode ser personalizada
                message: 'Validation error while processing your request',
                //erros
                errors: messages
            });

            break;
    }
    done();
}