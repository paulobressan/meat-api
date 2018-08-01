//importando o restify para criar o servidor
import * as restify from 'restify'

//Configurando o servidor, nome e versão
const server = restify.createServer({
    name:'meat-api',
    version: '1.0.0'
})

//Configurando um plugin para capturar os valores passado na url
server.use(restify.plugins.queryParser());

//criando um metodo get, uma rota valida
server.get('/info', (req, res, next) => {
    //criando uma resposta em json para quem o chamou
    res.json({
        //capturando dados do client
        browser: req.userAgent(),
        //capturando o metodo http tomado para realizar a requisição
        Method: req.method,
        //capturando a url
        url: req.url,
        //camminho completo
        path: req.path(),
        //parametros passados
        params: req.query
    });
    //Sempre que terminarmos o codigo no callback da rota, 
   // chamar o next para indicar que o metodo terminou
    return next();
})

//Esctuando o servidor na porta 3000
server.listen(3000, ()=>{
    console.log('API is running on http://localhost:3000');
})