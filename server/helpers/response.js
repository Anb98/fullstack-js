const {domain} = require('./../config');

module.exports = ( type )=>{

	const transformData = (data)=>({
		id: data.id || data._id,
		type,
		attributes: Object.fromEntries(
			Object.entries(data._doc)
			.filter( ([key, _]) => key !== 'id' && key !== '_id')
		)
	});

	const standar = (data, id)=> ({
		links: {
			self: !!id ? `http://${domain}/${type}/${id}` : `http://${domain}/${type}`
		},
		data: Array.isArray(data) ? data.map(transformData) : transformData(data),
	});

	return {
		standar,
	}
}