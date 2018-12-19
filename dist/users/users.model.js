"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//importando o mongoose para conectar com o mongodb
const mongoose = require("mongoose");
//importando validator de cpf
const validators_1 = require("../common/validators");
//importando o bcrypt
const bcrypt = require("bcrypt");
//importando environment
const environment_1 = require("../common/environment");
//criando um esquema do usuário para ser persistido no banco
const userSchema = new mongoose.Schema({
    name: {
        //indica o tipo do campo
        type: String,
        //validação para que o name seja obrigatório.
        required: true,
        //validando tamanho do caracter
        maxlength: 80,
        minlength: 3
    },
    email: {
        type: String,
        //indica que o email é unico
        unique: true,
        //validação para que o name seja obrigatório.
        required: true,
        //Validações com expressão regular para validar o email
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: {
        type: String,
        //bloqueia esse valor para que nas query não seja retornado
        select: false,
        //validação para que o name seja obrigatório.
        required: true
    },
    gender: {
        type: String,
        required: false,
        //validação de tipos de dados validos para esse campo, por exemplo, podemos utilizar um enum
        //que valida os tipos de dados que podem ser inserido
        enum: ['Male', 'Female']
    },
    cpf: {
        type: String,
        required: false,
        validate: {
            validator: validators_1.validateCPF,
            //exindo a mensagem, o mongoose interpreta como uma template string e por isso podemos exibir valores de variaveis
            message: '{PATH}: Invalid CPF ({VALUE})'
        }
        //validador personalizado
    },
    profiles: {
        type: [String],
        required: false
    }
});
//Metodos personalizados no model
//O mongoose recomenda usar function e não arrow function pelo fato do escopo
//Esse metodo é associado com o modelo, ou seja ele vai trabalhar sem usar o resto do contexto, por exemplo
//Ele vai fazer a busca e retornar os valores e nada mais
userSchema.statics.findByEmail = function (email, projection) {
    //O projection é uma configuração onde solicitamos o retorno do password
    //Foi definido select: false para não retornar o password no body
    return this.findOne({ email }, projection);
};
//Metodo de instancia, ele compara uma instancia que foi criada, pode ser um retorno de um model que é resultado de uma busca
//e com podemos trabalhar na instancia retornada, por exemplo validar um dado enviado de fora com o dado
//que esta na instancia, é o que esse metodo abaixo faz
//Compara o password do documento com um password passado
userSchema.methods.matches = function (password) {
    //o bcrypt tem a função compareSync que por sua vez ela pega o valor passado, 
    //simula a criptografia e compara a criptografia do contexto com a que foi passada
    //retornando true ou false
    return bcrypt.compareSync(password, this.password);
};
//Metodo de instancia para analizar se o usuário contem algum dos profile necessitado
userSchema.methods.hasAny = function (...profiles) {
    //Se qualquer valor que tiver no profiles passado como parametro estiver na instancia o usuário
    //Se tiver o valor de some vai ser um boolean
    return profiles.some(profile => this.profiles.indexOf(profile) !== -1);
};
// MIDDLEWARE's
// criando uma função que crie um hash criptografado do password
const hashPassword = (obj, next) => {
    bcrypt.hash(obj.password, environment_1.environment.security.saltRounds)
        .then(hash => {
        obj.password = hash;
        next();
    }).catch(next);
};
//Criando a função que o middleware vai executar
const saveMiddleware = function (next) {
    //identificar se estamos criando ou alterando o documento
    //O objeto this, é um objeto de contexto e dependendo da middleware (save, count, find, findbyid) ele representa
    //um documento uma query, como por exemplo o UpdateById, podemos ver na documentação do mongoose
    const user = this;
    //função isModified do mongoose para verificar se a prop foi alterada
    if (!user.isModified('password')) {
        next();
    }
    else {
        console.log("Middleware save");
        //criptografando o password se o valor foi alterado
        hashPassword(user, next);
    }
};
//middleware de update
const updateMiddleware = function (next) {
    //Se no escopo não conter atualização do password, não sera feito nada.
    if (!this.getUpdate().password) {
        next();
    }
    else {
        console.log("Middleware Update");
        //criptografando o password se o valor foi alterado
        //Podemos pegar os valores do schema com o escopo. (this.getUpdate().password)
        hashPassword(this.getUpdate(), next);
    }
};
//MIDDLEWARE
//Criando eventos para realizar processos quando o evento for acionado
//Vamos criar eventos para monitorar a persistencia de informação no schema
//Para isso o mongoose tem a função (pre) que espera como primeiro parametro o metodo que queremos monitorar(save)
//e como segundo parametro um callback onde passamos o next que funciona similar como o next do restify, ou seja
//assim que a middleware terminar o processo, ela vai indicar para o mongoose que ele pode prosseguir com o fluxo.
//Lembrando que não podemos utilizar o arrow para alterar o escopo do this utilizado.
userSchema.pre('save', saveMiddleware);
//Para realizar um middleware de update, temos que utilizar o seu metodo. (FindOneAndUpdate)
//metodo PATCH
userSchema.pre('findOneAndUpdate', updateMiddleware);
//Para realizar um middleware de update, temos que utilizar o seu metodo. (Update)
//metodo PUT
userSchema.pre('update', updateMiddleware);
//Estamos exportando a interface e essa constante, porem é apenas para um controle estatico de auto complite
//o module é exportado com o tipo da interface, com isso podemos atribuir valores as prop
//quando criar um novo documento
//Podemos tipar mais de um model, como por exemplo o model
exports.User = mongoose.model('User', userSchema);
//# sourceMappingURL=users.model.js.map