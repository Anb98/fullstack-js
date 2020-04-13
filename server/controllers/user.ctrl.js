const User = require('./../models/User');
const { encodePass } = require('./../helpers/encoding');
const { standar } = require('./../helpers/response')('users');

module.exports = {
	/**
	 * Returns all records in user
	 * @param {*} req Request object
	 * @param {*} res Response object
	 */
	 async index(req, res){
		try {
			const pageParams = req.query;
			
			const offset = (
				pageParams && 
				pageParams.page && 
				pageParams.page.offset && 
				!isNaN(Number(pageParams.page.offset)) 
			)
				? Number(pageParams.page.offset)
				: 0;

			const limit = (
				pageParams && 
				pageParams.page && 
				pageParams.page.limit &&
				!isNaN(Number(pageParams.page.limit)) 
			)
				? Number(pageParams.page.limit)
				: 10;

			const total = await User.estimatedDocumentCount();

			const records = await User.find({}).skip(offset).limit(limit);
	
			if(!records)
				return res.status(404).send('There are no users');
	
			res.status(200)
			.send(standar({data: records, meta:{ pagination: {offset, limit, total} }}));
			
		} catch (error) {
			res.status(500).send(`Error: ${error}`);
		}
	},

	/**
	 *  Stores a user
	 * @param {*} req Request object
	 * @param {*} res Response object
	 */
	async store(req, res){
		try {
			const resourceObject = req.body.data;
			const user = new User({
				...resourceObject.attributes,
				...resourceObject.attributes.password && { password: encodePass(resourceObject.attributes.password) },
			})
	
			const record = await user.save();
			res.status(201)
				.send( standar( {data:record, id: record._id, isNew:true}) )
			
		} catch (error) {
			res.status(500).send(`Error: ${error}`);
		}
	},
	
	/**
	 *  Returns a specific user by id
	 * @param {*} req Request object
	 * @param {*} res Response object
	 */
	async show(req, res){
		try {
			const id = req.params.id;
			const record = await User.findById(id);
			
			res.status(200).send(standar({data: record, id}));
		} catch (error) {
			res.status(500).send(`Error: ${error}`);
		}
	},

	/**
	 *  Updates a specific user by id
	 * @param {*} req Request object
	 * @param {*} res Response object
	 */
	async update(req, res){
		try {
			const id = req.params.id;
			const resourceObject = req.body.data;
			const record = await User.findByIdAndUpdate(id, {
				...resourceObject.attributes,
				...resourceObject.attributes.password && { password: encodePass(resourceObject.attributes.password) },
				updated_at: Date.now()
			});
			
			res.status(200).send(standar({data: await User.findById(id), id}));
		} catch (error) {
			res.status(500).send(`Error: ${error}`);
		}
	},
	
	
	/**
	 *  Deletes a specific user by id
	 * @param {*} req Request object
	 * @param {*} res Response object
	 */
	async destroy(req, res){
		try {
			const id = req.params.id;
			const record = await User.findByIdAndDelete(id);
			
			res.status(200).send(standar({data: record}));
		} catch (error) {
			res.status(500).send(`Error: ${error}`);
		}
	},
}