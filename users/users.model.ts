//importando o mongoose para conectar com o mongodb
import * as mongoose from 'mongoose';

//criando uma interface que representa o documento user
export interface User extends mongoose.Document{
    name: string,
    email: string,
    password: string
}

//criando um esquema do usuário para ser persistido no banco
const userSchema = new mongoose.Schema({
    name:{
        //indica o tipo do campo
        type: String
    },
    email:{
        type: String,
        //indica que o email é unico
        unique: true
    },
    password:{
        type: String,
        //bloqueia esse valor para que nas query não seja retornado
        select:false
    }
});

//Estamos exportando a interface e essa constante, porem é apenas para um controle estatico de auto complite
//o module é exportado com o tipo da interface, com isso podemos atribuir valores as prop
//quando criar um novo documento
export const User = mongoose.model<User>('User', userSchema);