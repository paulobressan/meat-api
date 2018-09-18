import * as restify from 'restify';
import { ModelRouter } from '../common/model-router';
//importando o model de usuarios
import { Review } from '../reviews/reviews.module';
import * as mongoose from 'mongoose';

class ReviewRouter extends ModelRouter<Review> {
    constructor() {
        super(Review);
    }

    //Envelopando links personalizados, individual
    //Criando links para acessar restaurant e user
    envelope(document:any){
        let resource = super.envelope(document);
        //pegando o restaurant id, o restaurant id pode ser o ID ou o restaurant populado, então temos que criar uma condição
        const restId = document.restaurant._id ? document.restaurant._id : document.restaurant;
        //Prop dinamica
        resource._links.restaurant = `/restaurants/${restId}`;
        return resource;
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
    //OU
    // findById = (req, resp, next) => {
    //     this.model.findById(req.params.id)
    //         .populate('user', 'name')
    //         .populate('restaurant','name')
    //         .then(
    //             this.render(resp, next)
    //         ).catch(next)
    // }

    applyRoutes(application: restify.Server) {
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, this.save);
    }
}

export const reviewsRouter = new ReviewRouter();