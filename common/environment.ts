//Arquivo de configurações default
export const environment = {
    //configuração do servidor, a porta que vai rodar, pegar a variavel de ambiente ou 3000
    server: { port: process.env.SERVER_PORT || 3000 },
    //configurações estatica do banco de dados
    db: {
        //url do mongo pegar na variavel de ambiente ou a local que é formada por
        //mongodb://DOMINIO/BANCO
        url: process.env.DB_URL || 'mongodb://localhost/meat-api'
    },
    security: {
        //Clicos que o bcrypt utilizadara para colocar uma informação dinamica para poder gerar o hash
        saltRounds: process.env.SALT_ROUNDS || 10,
        //chave secreta do jwt
        apiSecret: process.env.API_SECRET || 'meat-api-secret'
    }
}