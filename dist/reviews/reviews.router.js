"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
//importando o model de usuarios
const reviews_module_1 = require("../reviews/reviews.module");
class ReviewRouter extends model_router_1.ModelRouter {
    constructor() {
        super(reviews_module_1.Review);
    }
    //Envelopando links personalizados, individual
    //Criando links para acessar restaurant e user
    envelope(document) {
        let resource = super.envelope(document);
        //pegando o restaurant id, o restaurant id pode ser o ID ou o restaurant populado, então temos que criar uma condição
        const restId = document.restaurant._id ? document.restaurant._id : document.restaurant;
        //Prop dinamica
        resource._links.restaurant = `/restaurants/${restId}`;
        return resource;
    }
    //SOBRESCREVENDO O METODO DO ROUTER MODULE USADO NO FINDBYID. ASSIM PODEMOS PERSONALIZAR NOSSAS CONSULTAS
    //COMO POR EXEMPLO USANDO O POPULATE
    prepareOne(query) {
        //retornando a query utilizada no findbyid.
        //a query é personalizada para que possamos trazer as referencias do documento referenciados.
        return query
            .populate('user', 'name')
            .populate('restaurant', 'name');
    }
    //OU
    // findById = (req, resp, next) => {
    //     this.model.findById(req.params.id)
    //         .populate('user', 'name')
    //         .populate('restaurant','name')
    //         .then(
    //             this.render(resp, next)
    //         ).catch(next)
    // }
    applyRoutes(application) {
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, this.save);
    }
}
exports.reviewsRouter = new ReviewRouter();
//# sourceMappingURL=reviews.router.js.map