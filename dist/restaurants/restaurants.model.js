"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
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
});
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
        select: false,
        //valor explicito para o array menu, ou seja, o valor default do menu vai ser um array vazio
        default: []
    }
});
exports.Restaurant = mongoose.model('Restaurant', restaurantsSchema);
//# sourceMappingURL=restaurants.model.js.map