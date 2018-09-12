"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
//importando o model de usuarios
const reviews_module_1 = require("../reviews/reviews.module");
class ReviewRouter extends model_router_1.ModelRouter {
    constructor() {
        super(reviews_module_1.Review);
    }
    // findById = (req, resp, next) => {
    //     this.model.findById(req.params.id)
    //         .populate('user', 'name')
    //         .populate('restaurant')
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