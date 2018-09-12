import * as restify from 'restify';
import { ModelRouter } from '../common/model-router';
//importando o model de restaurante
import { Restaurant } from '../restaurants/restaurants.module';
//gerenciado de erros do restify
import { NotFoundError } from 'restify-errors';

class RestaurantRouter extends ModelRouter<Restaurant>{
    constructor(){
        super(Restaurant);
    }

    //O ModelRouter conta com chamdas "Padrões" que todo model usa, porem quando temos que realizar 
    //uma consulta especifica temos que criar uma função especifica para isso.
    findMenu = (req: restify.Request, resp:restify.Response, next:restify.Next) =>{
        //O findbyid podemos incluir projeções que queremos criar ou devolver
        //No caso o menu esta setado para que ao buscar não devolver o menu, porem
        //vamos definir uma projeção para que ao buscar o restaurante traga o menu
        Restaurant.findById(req.params.id, "+menu")
            .then(this.render(resp, next))
            .catch(next);
    }

    //replace de menu
    replaceMenu = (req: restify.Request, resp:restify.Response, next:restify.Next) =>{
        Restaurant.findById(req.params.id)
        .then(rest => {
            if(!rest) throw new NotFoundError('Documento não encontrado');
            else {
                rest.menu = req.body //array de menuItem
                return rest.save();
            }
        })
        .then(rest => {
            this.render(resp,next)(rest);
        })
        .catch(next);
    }


    
    applyRoutes(application: restify.Server) {
        application.get('/restaurants', this.findAll);
        application.get('/restaurants/:id', [this.validateId, this.findById]);
        application.post('/restaurants', this.save);
        application.put('/restaurants/:id', [this.validateId, this.replace]);
        application.patch('/restaurants/:id', [this.validateId, this.update]);
        application.del('/restaurants/:id',[this.validateId, this.delete]);
        //rotas para trabalhar com o sub documento Menu
        application.get('/restaurants/:id/menu', [this.validateId, this.findMenu]);
        application.put('/restaurants/:id/menu', [this.validateId, this.replaceMenu]);
    }
}

export const restaurantRouter = new RestaurantRouter();