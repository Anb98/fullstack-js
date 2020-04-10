const Product = require('./../models/Product');
const { standar } = require('./../helpers/response')('products');

module.exports = {
	/**
	 * Returns all records in product
	 * @param {*} req Request object
	 * @param {*} res Response object
	 */
	async index(req, res){
		try {
			const records = await Product.find({});

			if(!records)
				return res.status(404).send('There are no products');

			res.status(200)
			.send(standar(records));
		} catch (error) {
			
		}
	},

	/**
	 *  Stores a product
	 * @param {*} req Request object
	 * @param {*} res Response object
	 */
	async store(req, res){
		try {
			const product = new Product({
				SKU        : req.body.SKU,
				nombre     : req.body.nombre,
				cantidad   : req.bod.cantidad,
				precio     : req.bod.precio,
				descripcion: req.body.descripcion,
				imagen     : req.body.imagen,
			})
	
			const record = await product.save();
			res.status(201)
				.send( standar(record) )
			
		} catch (error) {
			res.status(500).send(`Error: ${error}`);
		}
	},

	/**
	 *  Returns a specific product by id
	 * @param {*} req Request object
	 * @param {*} res Response object
	 */
	show(req, res){
		try {
			const id = req.params.id;
			const record = await Product.findById(id);
			
			res.status(200).send(standar(record, id));
		} catch (error) {
			res.status(500).send(`Error: ${error}`);
		}
	},

	/**
	 *  Updates a specific product by id
	 * @param {*} req Request object
	 * @param {*} res Response object
	 */
	update(req, res){
		
	},

	/**
	 *  Deletes a specific product by id
	 * @param {*} req Request object
	 * @param {*} res Response object
	 */
	async destroy(req, res){
		try {
			const id = req.params.id;
			const record = await Product.findByIdAndDelete(id);
			
			res.status(200).send(standar(record));
		} catch (error) {
			res.status(500).send(`Error: ${error}`);
		}
	},
}