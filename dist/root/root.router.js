"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../common/router");
class RootRouter extends router_1.Router {
    applyRoutes(application) {
        application.get('/', (req, resp, next) => {
            this.routes = [
                { name: 'Restaurants', url: `/restaurants` },
                { name: 'Users', url: '/users' },
                { name: 'Reviews', url: '/reviews' }
            ];
            resp.json(this.routes);
            return next();
        });
    }
}
exports.rootRouter = new RootRouter();
//# sourceMappingURL=root.router.js.map