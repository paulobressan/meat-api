import { Router } from './router';
import * as mongoose from 'mongoose';

//Classe para abstrair a repetição de código de manipulção da base de dados. O mongoose.model no construtor espera
//o tipo de model que essa classe recebera, para isso temos que tornar generico a nossa classe com D extends mongoose.docuemnt
export abstract class ModelRouter<D extends mongoose.Document> extends Router {
    //É necessario passar no construtor o model que sera utilizado
    constructor(protected model: mongoose.Model<D>) {
        super();
    }

    //Abstraindo o find all
    findAll = (req, resp, next) => {
        this.model.find()
            .then(
                //metodo herdado de Router
                this.render(resp, next)
            ).catch(next)
    }

}