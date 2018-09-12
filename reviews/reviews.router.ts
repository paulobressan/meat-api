import * as restify from 'restify';
import { ModelRouter } from '../common/model-router';
//importando o model de usuarios
import { Review } from '../reviews/reviews.module';
//gerenciado de erros do restify
import { NotFoundError } from 'restify-errors';

class ReviewRouter extends ModelRouter<Review> {
    constructor(){
        super(Review);
    }

    // findById = (req, resp, next) => {
    //     this.model.findById(req.params.id)
    //         .populate('user', 'name')
    //         .populate('restaurant')
    //         .then(
    //             this.render(resp, next)
    //         ).catch(next)
    // }

    applyRoutes(application: restify.Server) {
        application.get('/reviews', this.findAll);
        application.get('/reviews/:id', [this.validateId, this.findById]);
        application.post('/reviews', this.save);
    }
}

export const reviewsRouter = new ReviewRouter();