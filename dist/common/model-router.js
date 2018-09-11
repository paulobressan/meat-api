"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./router");
//Classe para abstrair a repetição de código de manipulção da base de dados. O mongoose.model no construtor espera
//o tipo de model que essa classe recebera, para isso temos que tornar generico a nossa classe com D extends mongoose.docuemnt
class ModelRouter extends router_1.Router {
    //É necessario passar no construtor o model que sera utilizado
    constructor(model) {
        super();
        this.model = model;
        //Abstraindo o find all
        this.findAll = (req, resp, next) => {
            this.model.find()
                .then(
            //metodo herdado de Router
            this.render(resp, next)).catch(next);
        };
    }
}
exports.ModelRouter = ModelRouter;
//# sourceMappingURL=model-router.js.map