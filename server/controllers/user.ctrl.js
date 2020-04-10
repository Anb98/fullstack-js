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
			const user = new User({
				...req.body.nombre && { nombre: req.body.nombre },
				...req.body.telefono && { telefono: req.body.telefono },
				...req.body.username && { username: req.body.username },
				...req.body.fecha_nacimiento && { fecha_nacimiento: req.body.fecha_nacimiento },
				...req.body.email && { email: req.body.email },
				...req.body.password && { password: encodePass(req.body.password) },
			})
	
			const record = await user.save();
			res.status(201)
				.send( standar(record) )
			
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
			const record = await User.findByIdAndUpdate(id, {
				...req.body.nombre && { nombre: req.body.nombre },
				...req.body.telefono && { telefono: req.body.telefono },
				...req.body.username && { username: req.body.username },
				...req.body.fecha_nacimiento && { fecha_nacimiento: req.body.fecha_nacimiento },
				...req.body.email && { email: req.body.email },
				...req.body.password && { password: encodePass(req.body.password) },
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