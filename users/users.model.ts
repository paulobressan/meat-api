//importando o mongoose para conectar com o mongodb
import * as mongoose from 'mongoose';
//importando validator de cpf
import { validateCPF } from '../common/validators';
//importando o bcrypt
import * as bcrypt from 'bcrypt';
//importando environment
import { environment } from '../common/environment';

//criando uma interface que representa o documento user
export interface User extends mongoose.Document {
    name: string,
    email: string,
    password: string,
    gender: string,
    cpf: string
}

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
            validator: validateCPF,
            //exindo a mensagem, o mongoose interpreta como uma template string e por isso podemos exibir valores de variaveis
            message: '{PATH}: Invalid CPF ({VALUE})'
        }
        //validador personalizado
    }
});

//MIDDLEWARE
//Criando eventos para realizar processos quando o evento for acionado
//Vamos criar eventos para monitorar a persistencia de informação no schema
//Para isso o mongoose tem a função (pre) que espera como primeiro parametro o metodo que queremos monitorar(save)
//e como segundo parametro um callback onde passamos o next que funciona similar como o next do restify, ou seja
//assim que a middleware terminar o processo, ela vai indicar para o mongoose que ele pode prosseguir com o fluxo.
//Lembrando que não podemos utilizar o arrow para alterar o escopo do this utilizado.
userSchema.pre('save', function (next) {
    //identificar se estamos criando ou alterando o documento
    //O objeto this, é um objeto de contexto e dependendo da middleware (save, count, find, findbyid) ele representa
    //um documento uma query, como por exemplo o UpdateById, podemos ver na documentação do mongoose
    const user: User = <User>this;
    //função isModified do mongoose para verificar se a prop foi alterada
    if (!user.isModified('password')) {
        next();
    } else {
        //criptografando o password se o valor foi alterado
        bcrypt.hash(user.password, environment.security.saltRounds)
            .then(hash => {
                user.password = hash;
                next();
            }).catch(next())
    }
});

//Estamos exportando a interface e essa constante, porem é apenas para um controle estatico de auto complite
//o module é exportado com o tipo da interface, com isso podemos atribuir valores as prop
//quando criar um novo documento
export const User = mongoose.model<User>('User', userSchema);