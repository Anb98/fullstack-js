const { meta } =require('./../helpers/response')('');

module.exports = (req, res, next)=>{
	const resourceObject = req.body.data;

	if(!resourceObject 
		|| !resourceObject.type 
		|| !resourceObject.attributes
		|| resourceObject.type !== req.baseUrl.replace('/','')
		|| (  req.route.methods.patch 
			&& ( !resourceObject.id || req.params.id != resourceObject.id )
		)
	)
		return res.status(400).send({
			meta:meta,
			errors: [
				{
					status: '400',
					title: 'Malformed resource object'
				}
			]
		})

	next();
}