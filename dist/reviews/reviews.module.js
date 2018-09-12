"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comments: {
        type: String,
        required: true,
        maxlength: 500
    },
    //Associação ao erw
    restaurant: {
        //o documento vai ser referenciado pelo id. (associação para o ObjectId do documento)
        //Usado apenas na declarão de referencias
        type: mongoose.Schema.Types.ObjectId,
        //O nome do modelo que sera referenciado
        ref: 'Restaurant',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
exports.Review = mongoose.model('Review', reviewSchema);
//# sourceMappingURL=reviews.module.js.map