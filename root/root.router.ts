import * as restify from 'restify';
import {Router} from '../common/router';
import {RootModule} from './root.module';

class RootRouter extends Router{
    routes:RootModule[];
    applyRoutes(application: restify.Server) {
        application.get('/', (req:restify.Request, resp:restify.Response, next:restify.Next) => {
            this.routes = [
                {name:'Restaurants', url:`/restaurants`},
                {name:'Users', url:'/users'},
                {name:'Reviews', url:'/reviews'}
            ]
            resp.json(this.routes);
            return next();
        });
    }
}

export const rootRouter = new RootRouter();