import { Router } from './router';
import * as mongoose from 'mongoose';
//gerenciado de erros do restify
import { NotFoundError } from 'restify-errors';

//Classe para abstrair a repetição de código de manipulção da base de dados. O mongoose.model no construtor espera
//o tipo de model que essa classe recebera, para isso temos que tornar generico a nossa classe com D extends mongoose.docuemnt
export abstract class ModelRouter<D extends mongoose.Document> extends Router {
    //É necessario passar no construtor o model que sera utilizado
    constructor(protected model: mongoose.Model<D>) {
        super();
    }

    //metodo para preparar query de uma consulta
    //<d, d> Ela trabalha com um tipo e retorna o mesmo tipo
    protected prepareOne(query: mongoose.DocumentQuery<D, D>): mongoose.DocumentQuery<D, D> {
        return query;
    }

    //metodo para preparar query da consulta todos documentos
    protected prepareAll(query: mongoose.DocumentQuery<D[], D>): mongoose.DocumentQuery<D[], D> {
        return query;
    }

    //sobreescrevendo o metodo envelope para envelopar alguns dados(HYPERMEDIA)
    envelope(document: any): any {
        //O assign inicializa um documento, no caso abaixo com documento vazio e o segundo parametro é os valores
        let resource = Object.assign({ _links: {} }, document.toJSON());
        return resource;
    }

    //validar o ID se esta no formato correto
    //essa função é utilizada nas rotas, onde a rota suporta um array de callback, portanto temos uma sequença de execução
    //primeiro callback é o validateId porque se o id não for valido vamos retornar um 404 se não podemos ir para o proximo callback.
    validateId = (req, resp, next) => {
        //Usar validação do mongoose para validar se o id esta valido
        if (!mongoose.Types.ObjectId.isValid(req.params.id))
            next(new NotFoundError("Document not found"));
        next();
    }

    //Abstraindo o find all
    findAll = (req, resp, next) => {
        this.prepareAll(this.model.find())
            .then(
                //metodo herdado de Router
                this.render(resp, next)
            ).catch(next)
    }

    findById = (req, resp, next) => {
        //usando o metodo prepareOne para que possa ser personalizada a query da consulta
        this.prepareOne(this.model.findById(req.params.id))
            .then(
                this.render(resp, next)
            ).catch(next)
    }

    save = (req, resp, next) => {
        //Criando um novo documento do schema de User
        //podemos passar direto o req.body desque estamos utilizando o plugin body parser
        let user = new this.model(req.body);
        user.save()
            .then(this.render(resp, next))
            .catch(next)
    }

    replace = (req, resp, next) => {
        //Para que as validações funcione para os metodos de update, temos que ativar o runValidators
        const options = {
            runValidators: true, //Ativa as validações para metodos de updates
            overwrite: true //Aplica a subscrita no documento completo.
        }
        //por padrão o update sempre altera os dados parcialmente e no caso abaixo
        //queremos alterar todas prop do documento com as prop do body recebida
        this.model.update({ _id: req.params.id }, req.body, options)
            //o update retorna uma query e temos que executar essa query para poder aplicar a promisse
            .exec()
            .then(result => {
                //Se o documento foi subscrevido
                if (result.n)
                    //Se não aplicar a alteração no documento é porque o documento não existe.
                    throw new NotFoundError('Documento não encontrado');
                //Se o documento foi alterado, vamos retornar o documento alterado
                return this.prepareOne(this.model.findById(req.params.id));
            })
            .then(this.render(resp, next))
            .catch(next)
    }

    update = (req, resp, next) => {
        //O findByIdUpdate retorna na promise o documento desatualizado e por isso temos que
        //criar uma options que retornara o documento atualizado
        const options = {
            runValidators: true,
            new: true //Retornar o objeto atualizado
        }
        //alterando parcialmente um documento, no put foi feito manualmente a atualização do 
        //documento, o findByIdAndUpdate é uma forma mais produtiva onde ele ja busca o documento
        // que vai ser alterado
        this.model.findOneAndUpdate(req.params.id, req.body, options)
            .then(this.render(resp, next))
            .catch(next)
    }

    delete = (req, resp, next) => {
        //como não queremos retornar nada depois que remover, podemos simplesmente usar o metodo remove
        //Se for preciso retorna podemos utilizar o metodo findByIdAndRemove
        this.model.remove({ _id: req.params.id })
            .exec()
            .then((result: any) => {
                //Se o algum documento foi afetado
                if (!result.n)
                    //Se não é porque não encontrou nenhum documento com o id passado
                    throw new NotFoundError('Documento não encontrado');
                return next();
            }).catch(next)
    }
}