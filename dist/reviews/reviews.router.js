"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
//importando o model de usuarios
const reviews_module_1 = require("../reviews/reviews.module");
class ReviewRouter extends model_router_1.ModelRouter {
    constructor() {
        super(reviews_module_1.Review);
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
    // findById = (req, resp, next) => {
    //     this.model.findById(req.params.id)
    //         .populate('user', 'name')
    //         .populate('restaurant','name')
    //         .then(
    //             this.render(resp, next)
    //         ).catch(next)
    // }
    applyRoutes(application) {
        application.get('/reviews', this.findAll);
        application.get('/reviews/:id', [this.validateId, this.findById]);
        application.post('/reviews', this.save);
    }
}
exports.reviewsRouter = new ReviewRouter();
//# sourceMappingURL=reviews.router.js.map