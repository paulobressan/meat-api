//importando o mongoose para conectar com o mongodb
import * as mongoose from 'mongoose';

//criando uma interface que representa o documento user
export interface User extends mongoose.Document {
    name: string,
    email: string,
    password: string
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
    }
});

//Estamos exportando a interface e essa constante, porem é apenas para um controle estatico de auto complite
//o module é exportado com o tipo da interface, com isso podemos atribuir valores as prop
//quando criar um novo documento
export const User = mongoose.model<User>('User', userSchema);