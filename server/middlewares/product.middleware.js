const Joi = require('@hapi/joi');
const { meta } =require('./../helpers/response')('');

module.exports = {
	validateSave(req, res, next){
		const shema = Joi.object({
			SKU        : Joi.string().min(1).optional(),
			nombre     : Joi.string().min(3).max(150).required(),
			cantidad   : Joi.number().required(),
			precio     : Joi.number().precision(2).required(),
			descripcion: Joi.string().optional(),
			imagen     : Joi.string().dataUri().optional(),
		});

		const result = shema.validate(req.body.data.attributes);
		
		if(result.error)
			return res.status(409).json({ 
				meta,
				errors: [
					{
						title:'Malfomed request data',
						detail: result.error
					}
				]
			});
		
		next();
	},
	validateUpdate(req, res, next){
		const shema = Joi.object({
			SKU        : Joi.string().min(1).optional(),
			nombre     : Joi.string().min(3).max(150).optional(),
			cantidad   : Joi.number().optional(),
			precio     : Joi.number().precision(2).optional(),
			descripcion: Joi.string().optional(),
			imagen     : Joi.string().dataUri().optional(),

		});

		const result = shema.validate(req.body.data.attributes);
		
		if(result.error)
			return res.status(409).json({ 
				meta,
				errors: [
					{
						title:'Malfomed request data',
						detail: result.error
					}
				]
			});
		
		next();
	}
}