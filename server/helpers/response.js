const {domain} = require('./../config');

module.exports = ( type )=>{

	const transformData = (data, isNew)=>({
		id: data.id || data._id,
		type,
		attributes: {
			...Object.fromEntries(
				Object.entries(data._doc)
				.filter( ([key, _]) => key !== 'id' && key !== '_id')
			),
			...isNew && {
				links: { self:`http://${domain}/${type}/${data.id || data._id}`}
			},
		}
	});

	const meta = {
		author: "Abdiel Martinez"
	}

	const standar = (data, id, isNew)=> ({
		meta,
		...!isNew && {
			links: {
				self: id && !isNew ? `http://${domain}/${type}/${id}` : `http://${domain}/${type}`
			}
		},
		data: Array.isArray(data) ? data.map(el=> transformData(el)) : transformData(data, isNew),
	});

	return {
		meta,
		standar,
	}
}