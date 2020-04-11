const Joi = require('@hapi/joi');
const { meta } =require('./../helpers/response')('');

module.exports = {
	validateSave(req, res, next){
		const shema = Joi.object({
			nombre          : Joi.string().min(3).max(70).required(),
			telefono        : Joi.number().integer().min(10000000).max(9999999999999).required(),
			username        : Joi.string().min(3).max(15).required(),
			fecha_nacimiento: Joi.string().optional(),
			email           : Joi.string().email().required(),
			password        : Joi.string().required(),
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
			nombre          : Joi.string().min(3).max(70).optional(),
			telefono        : Joi.number().integer().min(10000000).max(9999999999999).optional(),
			username        : Joi.string().min(3).max(15).optional(),
			fecha_nacimiento: Joi.string().optional(),
			email           : Joi.string().email().optional(),
			password        : Joi.string().optional(),
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