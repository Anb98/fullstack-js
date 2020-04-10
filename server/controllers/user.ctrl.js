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
			const records = await User.find({});
	
			if(!records)
				return res.status(404).send('There are no users');
	
			res.status(200)
				.send( standar(records) );
			
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
				.send( standar(record, record._id, true) )
			
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
			
			res.status(200).send(standar(record, id));
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
			
			res.status(200).send(standar(await User.findById(id), id));
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
			
			res.status(200).send(standar(record));
		} catch (error) {
			res.status(500).send(`Error: ${error}`);
		}
	},
}