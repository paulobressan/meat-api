"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./router");
const mongoose = require("mongoose");
//gerenciado de erros do restify
const restify_errors_1 = require("restify-errors");
//Classe para abstrair a repetição de código de manipulção da base de dados. O mongoose.model no construtor espera
//o tipo de model que essa classe recebera, para isso temos que tornar generico a nossa classe com D extends mongoose.docuemnt
class ModelRouter extends router_1.Router {
    //É necessario passar no construtor o model que sera utilizado
    constructor(model) {
        super();
        this.model = model;
        //Propriedade para definir o tamanho de registro devolvido
        this.pageSize = 2;
        //validar o ID se esta no formato correto
        //essa função é utilizada nas rotas, onde a rota suporta um array de callback, portanto temos uma sequença de execução
        //primeiro callback é o validateId porque se o id não for valido vamos retornar um 404 se não podemos ir para o proximo callback.
        this.validateId = (req, resp, next) => {
            //Usar validação do mongoose para validar se o id esta valido
            if (!mongoose.Types.ObjectId.isValid(req.params.id))
                next(new restify_errors_1.NotFoundError("Document not found"));
            next();
        };
        //Abstraindo o find all
        //Pode-se paginar com o metodo limit
        this.findAll = (req, resp, next) => {
            //passando a pagina no parametro
            let page = parseInt(req.query._page || 1);
            //Se não for enviado a pagina, a pagina default é 1.
            page = page > 0 ? page : 1;
            //Skip é quantos registros ele vai pular para começar a nova pagina.
            let skip = this.pageSize * (page - 1);
            //pegando o count da coleção
            this.model
                .count({}).exec()
                .then(count => this.prepareAll(this.model.find())
                //Pulando os registro de acordo com a pagina
                .skip(skip)
                //limite de registro
                .limit(this.pageSize)
                .then(
            //metodo herdado de Router, passando uma options para que possa ser utilizado na paginação
            this.renderAll(resp, next, { page, count, pageSize: this.pageSize, url: req.url })))
                .catch(next);
        };
        this.findById = (req, resp, next) => {
            //usando o metodo prepareOne para que possa ser personalizada a query da consulta
            this.prepareOne(this.model.findById(req.params.id))
                .then(this.render(resp, next)).catch(next);
        };
        this.save = (req, resp, next) => {
            //Criando um novo documento do schema de User
            //podemos passar direto o req.body desque estamos utilizando o plugin body parser
            let user = new this.model(req.body);
            user.save()
                .then(this.render(resp, next))
                .catch(next);
        };
        this.replace = (req, resp, next) => {
            //Para que as validações funcione para os metodos de update, temos que ativar o runValidators
            const options = {
                runValidators: true,
                overwrite: true //Aplica a subscrita no documento completo.
            };
            //por padrão o update sempre altera os dados parcialmente e no caso abaixo
            //queremos alterar todas prop do documento com as prop do body recebida
            this.model.update({ _id: req.params.id }, req.body, options)
                //o update retorna uma query e temos que executar essa query para poder aplicar a promisse
                .exec()
                .then(result => {
                //Se o documento foi subscrevido
                if (result.n)
                    //Se não aplicar a alteração no documento é porque o documento não existe.
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                //Se o documento foi alterado, vamos retornar o documento alterado
                return result;
            })
                .then(this.render(resp, next))
                .catch(next);
        };
        this.update = (req, resp, next) => {
            //O findByIdUpdate retorna na promise o documento desatualizado e por isso temos que
            //criar uma options que retornara o documento atualizado
            const options = {
                runValidators: true,
                new: true //Retornar o objeto atualizado
            };
            //alterando parcialmente um documento, no put foi feito manualmente a atualização do 
            //documento, o findByIdAndUpdate é uma forma mais produtiva onde ele ja busca o documento
            // que vai ser alterado
            this.model.findOneAndUpdate(req.params.id, req.body, options)
                .then(this.render(resp, next))
                .catch(next);
        };
        this.delete = (req, resp, next) => {
            //como não queremos retornar nada depois que remover, podemos simplesmente usar o metodo remove
            //Se for preciso retorna podemos utilizar o metodo findByIdAndRemove
            this.model.remove({ _id: req.params.id })
                .exec()
                .then((result) => {
                //Se o algum documento foi afetado
                if (!result.n)
                    //Se não é porque não encontrou nenhum documento com o id passado
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                return next();
            }).catch(next);
        };
        //Se algum modelo ter uma rota personalizada, pordemos usar o base path para criar o link de rotas personalizadas
        this.basePath = `/${this.model.collection.name}`;
    }
    //metodo para preparar query de uma consulta
    //<d, d> Ela trabalha com um tipo e retorna o mesmo tipo
    prepareOne(query) {
        return query;
    }
    //metodo para preparar query da consulta todos documentos
    prepareAll(query) {
        return query;
    }
    //envelopando os documentos, e adicionando links para proxima pagina e pagina anterior e 
    //quantidade de itens
    envelopeAll(documents, options = {}) {
        //resource é o objeto envelopado
        const resource = {
            //links de controle de paginação
            _links: {
                self: options.url
            },
            //schemas solicitados
            items: documents
        };
        //opções para paginação
        if (options.page && options.count && options.pageSize) {
            if (options.page > 1) {
                resource._links.previous = `${this.basePath}?_page=${options.page - 1}`;
            }
            //Se remaing(proximos itens) for maior do que 0, existe itens para a proxima pagina
            //Se não, não sera renderizado o link next 
            const remaing = options.count - (options.page * options.pageSize);
            if (remaing > 0)
                resource._links.next = `${this.basePath}?_page=${options.page + 1}`;
        }
        return resource;
    }
    //sobreescrevendo o metodo envelope para envelopar alguns dados(HYPERMEDIA)
    envelope(document) {
        //O assign inicializa um documento, no caso abaixo com documento vazio e o segundo parametro é os valores
        let resource = Object.assign({ _links: {} }, document.toJSON());
        //Criando link para acesso ao documento
        resource._links.self = `${ /*Nome da coleção do contexto*/this.basePath}/${ /*Pegando o id do documento*/resource._id}`;
        return resource;
    }
}
exports.ModelRouter = ModelRouter;
//# sourceMappingURL=model-router.js.map