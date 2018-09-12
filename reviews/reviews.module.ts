import * as mongoose from 'mongoose';
import { Restaurant } from '../restaurants/restaurants.module';
import { User } from '../users/users.model';

//MODULO EXEMPLOS DE REFERENCIAS DE DOCUMENTOS
//exemplo de comentarios sobre os restaurantes
export interface Review extends mongoose.Document{
    date: Date,
    rating: number,
    comments: string,
    //esse obejto mongoose.types.objectId é o objeto que representa o ObjectId em runtime
    //ele pode ser restaurants ou objectId, usado para que quando for feito o find, ele vai ser preenchido
    //com o ObjectId porem depois vamos populo com o Restaurant
    restaurant: mongoose.Types.ObjectId | Restaurant,
    user: mongoose.Types.ObjectId | User
}

const reviewSchema = new mongoose.Schema({
    date: {
        type:Date,
        required:true
    } ,
    rating:{
        type:Number,
        required:true
    },
    comments:{
        type:String,
        required:true,
        maxlength:500
    },
    //Associação ao erw
    restaurant:{
        //o documento vai ser referenciado pelo id. (associação para o ObjectId do documento)
        //Usado apenas na declarão de referencias
        type: mongoose.Schema.Types.ObjectId,
        //O nome do modelo que sera referenciado
        ref:'Restaurant',
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    }
});

export const Review = mongoose.model<Review>('Review', reviewSchema);