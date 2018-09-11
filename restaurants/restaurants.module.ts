import * as mongoose from 'mongoose';

//SUB DOCUMENTS
export interface MenuItem extends mongoose.Document {
    name: string,
    price: number
}

//DOCUMENT
export interface Restaurants extends mongoose.Document {
    name: string,
    menu: MenuItem[]
}

//SCHEMA DO SUB DOCUMENTO
const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

//SCHEMA DO DOCUMENTO
const restaurantsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    menu: {
        //O restaurant tem uma coleção de sub documento do esquema de menu item.
        type: [menuSchema],
        //o menu do restaurant pode ser opcional
        required: false,
        //Quando for feito um find no restaurant, temos que tomar o cuidado para não trazer os menu porque pode ser que o menu seja muito grande
        //e assim deixar lenta a API
        select: false, //por default o menu não vai traser
        //valor explicito para o array menu, ou seja, o valor default do menu vai ser um array vazio
        default: []
    }
})

export const restaurant = mongoose.model<Restaurants>('Restaurant', restaurantsSchema);