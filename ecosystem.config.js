module.exports = {
  //Aplicações que vão ser executadas
  apps: [
    //Uma aplicação por exemplo a meat-api
    {
      //O seu nome
      name: "meat-api",
      //Caminho do script de execução
      script: "./dist/main.js",
      //Quantas instancias sera usada, lembrando da regra que se tiver 0, vai ser instanciada o maximo do processados
      instances: 0,
      //O modo de execução, se for 0 temos que colocar cluster pelo motivo que se subir o instances: 0 e o modo fork, 1 processo vai executar em 
      //uma porta e os outros vão tentar usar a mesma porta e vai ocorrer os conflitos de porta, então é necessario
      //usar o cluster quando a instance for 0, assim vai ser instanciado uma instancia master que vai balancear
      //os processos para as outras intancias
      exec_mode: "cluster",
      //O watch é para o pm2 ficar escutando alterações no arquivo scrip main.js, quando tiver alteração
      //Ele vai executar restart na aplicação
      watch: true,
      //E as variaveis de ambiente que a aplicação vai conter, lembrando o arquivo environment.ts
      env: {
        SERVER_PORT: 3000,
        DB_URL: 'mongodb://localhost/meat-api',
        //Variavel que define o ambiente que vai ser executado
        NODE_ENV: 'development'
      },
      //O pm2 da suporte para termos outros ambientes, como por exemplo um ambiente de teste com as variaveis de ambiente de teste
      env_production: {
        SERVER_PORT: 5001,
        NODE_ENV: 'production'
      }
    }
  ]
}
