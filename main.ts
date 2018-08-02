import {Server} from './server/server';
//importando instancias de rotas e passando como parametro para o boostrap do servidor
//nele criamos um roteador que passar por cada rota importada e passada para o bootstrap
//e assim declarando rota por rota
import {usersRouters} from './users/users.router';

//criando uma instancia de server
const server = new Server();
//Chamar o boostrap que inicializa o servidor e passamos como parametro as rotas
server.bootstrap([usersRouters]).then(server=>{
    //Se tudo der certo, vamos logar no terminar a porta que esta rodando o servidor.
    console.log('Servidor rodando ', server.application.address());
}).catch(err => {
    //Se ocorrer erro, vamos logar que houve erro e o erro
    console.log('Erro no servidor');
    console.log(err);
    process.exit(1);
});