const path = require('path');
const { domain } = require('./../config');
const { meta } =require('./../helpers/response')('');
const fs = require('fs');
const { v4 } = require('uuid');

module.exports = (req, res, next)=>{
	if(!req.body.data.attributes.imagen)
		return next();

	const base64 = req.body.data.attributes.imagen;

	if(!base64.includes('data:image'))
		return res.status(409).json({ 
			meta,
			errors: [
				{
					title:'Malfomed request data',
					detail: 'base64 imagen malformed'
				}
			]
		});


	const img = {
		ext: base64.split(',')[0].split(';')[0].split('/')[1],
		name: v4(),
	}

	const imgPath = ['images', `${img.name}.${img.ext}`];
	const resourcePath = path.join(process.cwd(), 'public', ...imgPath );

	fs.writeFile(resourcePath, base64.split(',')[1], 'base64', (err)=>{
		if(err) 
			return res.status(500).json({ 
				meta,
				errors: [
					{
						title:'Server error',
						detail: err
					}
				]
			});

		req.body.data.attributes.imagen = `http://${domain}:3000/${imgPath.join('/')}`
		next();
	})
}