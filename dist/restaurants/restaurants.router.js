"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
//importando o model de restaurante
const restaurants_model_1 = require("./restaurants.model");
//gerenciado de erros do restify
const restify_errors_1 = require("restify-errors");
class RestaurantRouter extends model_router_1.ModelRouter {
    constructor() {
        super(restaurants_model_1.Restaurant);
        //O ModelRouter conta com chamdas "Padrões" que todo model usa, porem quando temos que realizar 
        //uma consulta especifica temos que criar uma função especifica para isso.
        this.findMenu = (req, resp, next) => {
            //O findbyid podemos incluir projeções que queremos criar ou devolver
            //No caso o menu esta setado para que ao buscar não devolver o menu, porem
            //vamos definir uma projeção para que ao buscar o restaurante traga o menu
            restaurants_model_1.Restaurant.findById(req.params.id, "+menu")
                .then(this.render(resp, next))
                .catch(next);
        };
        //replace de menu
        this.replaceMenu = (req, resp, next) => {
            restaurants_model_1.Restaurant.findById(req.params.id)
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
    //Envelopando links personalizados, individual
    //Não é necessario subscrever o metodo, temos que adicionar novos links e para isso vamos
    //Usar o super para trazer o conteudo pai sem subscrever
    envelope(document) {
        let resource = super.envelope(document);
        //Link para acessar o menu 
        resource._links.menu = `${this.basePath}/${document._id}/menu`;
        return resource;
    }
    applyRoutes(application) {
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, this.save);
        application.put(`${this.basePath}/:id`, [this.validateId, this.replace]);
        application.patch(`${this.basePath}/:id`, [this.validateId, this.update]);
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete]);
        //rotas para trabalhar com o sub documento Menu
        application.get(`${this.basePath}/:id/menu`, [this.validateId, this.findMenu]);
        application.put(`${this.basePath}/:id/menu`, [this.validateId, this.replaceMenu]);
    }
}
exports.restaurantRouter = new RestaurantRouter();
//# sourceMappingURL=restaurants.router.js.map