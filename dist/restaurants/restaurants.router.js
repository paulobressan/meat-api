"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
//importando o model de restaurante
const restaurants_module_1 = require("../restaurants/restaurants.module");
//gerenciado de erros do restify
const restify_errors_1 = require("restify-errors");
class RestaurantRouter extends model_router_1.ModelRouter {
    constructor() {
        super(restaurants_module_1.Restaurant);
        //O ModelRouter conta com chamdas "Padrões" que todo model usa, porem quando temos que realizar 
        //uma consulta especifica temos que criar uma função especifica para isso.
        this.findMenu = (req, resp, next) => {
            //O findbyid podemos incluir projeções que queremos criar ou devolver
            //No caso o menu esta setado para que ao buscar não devolver o menu, porem
            //vamos definir uma projeção para que ao buscar o restaurante traga o menu
            restaurants_module_1.Restaurant.findById(req.params.id, "+menu")
                .then(this.render(resp, next))
                .catch(next);
        };
        //replace de menu
        this.replaceMenu = (req, resp, next) => {
            restaurants_module_1.Restaurant.findById(req.params.id)
                .then(rest => {
                if (!rest)
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                else {
                    rest.menu = req.body; //array de menuItem
                    return rest.save();
                }
            })
                .then(rest => {
                this.render(resp, next)(rest);
            })
                .catch(next);
        };
    }
    applyRoutes(application) {
        application.get('/restaurants', this.findAll);
        application.get('/restaurants/:id', [this.validateId, this.findById]);
        application.post('/restaurants', this.save);
        application.put('/restaurants/:id', [this.validateId, this.replace]);
        application.patch('/restaurants/:id', [this.validateId, this.update]);
        application.del('/restaurants/:id', [this.validateId, this.delete]);
        //rotas para trabalhar com o sub documento Menu
        application.get('/restaurants/:id/menu', [this.validateId, this.findMenu]);
        application.put('/restaurants/:id/menu', [this.validateId, this.replaceMenu]);
    }
}
exports.restaurantRouter = new RestaurantRouter();
//# sourceMappingURL=restaurants.router.js.map