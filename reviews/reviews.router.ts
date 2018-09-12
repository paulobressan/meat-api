import * as restify from 'restify';
import { ModelRouter } from '../common/model-router';
//importando o model de usuarios
import { Review } from '../reviews/reviews.module';
//gerenciado de erros do restify
import { NotFoundError } from 'restify-errors';
import * as mongoose from 'mongoose';

class ReviewRouter extends ModelRouter<Review> {
    constructor() {
        super(Review);
    }

    //SOBRESCREVENDO O METODO DO ROUTER MODULE USADO NO FINDBYID. ASSIM PODEMOS PERSONALIZAR NOSSAS CONSULTAS
    //COMO POR EXEMPLO USANDO O POPULATE
    protected prepareOne(query: mongoose.DocumentQuery<Review, Review>): mongoose.DocumentQuery<Review, Review> {
        //retornando a query utilizada no findbyid.
        //a query é personalizada para que possamos trazer as referencias do documento referenciados.
        return query
            .populate('user','name')
            .populate('restaurant','name')
    }
    // findById = (req, resp, next) => {
    //     this.model.findById(req.params.id)
    //         .populate('user', 'name')
    //         .populate('restaurant','name')
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