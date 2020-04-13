const Product = require('./../models/Product');
const { standar, meta } = require('./../helpers/response')('products');

module.exports = {
	/**
	 * Returns all records in product
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


			const records = await Product.find({}).skip(offset).limit(limit);
			const total = await Product.estimatedDocumentCount();

			if(!records)
				return res.status(404).send('There are no products');

			res.status(200)
				.send(standar({data: records, meta:{ pagination: {offset, limit, total} }}));
		} catch (error) {
			res.status(500).json({ 
				meta,
				errors: [ error ]
			});
		}
	},

	/**
	 *  Stores a product
	 * @param {*} req Request object
	 * @param {*} res Response object
	 */
	async store(req, res){
		try {
			const resourceObject = req.body.data;

			const product = new Product({...resourceObject.attributes})
	
			const record = await product.save();
			res.status(201)
				.send( standar( {data:record, id: record._id, isNew:true}) )
			
		} catch (error) {
			res.status(500).json({ 
				meta,
				errors: [ error ]
			});
		}
	},

	/**
	 *  Returns a specific product by id
	 * @param {*} req Request object
	 * @param {*} res Response object
	 */
	async show(req, res){
		try {
			const id = req.params.id;
			const record = await Product.findById(id);
			
			res.status(200).send(standar({data: record, id}));
		} catch (error) {
			res.status(500).json({ 
				meta,
				errors: [ error ]
			});
		}
	},

	/**
	 *  Updates a specific product by id
	 * @param {*} req Request object
	 * @param {*} res Response object
	 */
	async update(req, res){
		try {
			const id = req.params.id;
			const resourceObject = req.body.data;
			const record = await Product.findByIdAndUpdate(id, {
				...resourceObject.attributes,
				updated_at: Date.now()
			});
			
			res.status(200).send(standar({data: await Product.findById(id), id}));
		} catch (error) {
			res.status(500).json({ 
				meta,
				errors: [ error ]
			});
		}
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
			
			res.status(200).json({meta});
		} catch (error) {
			res.status(500).json({ 
				meta,
				errors: [ error ]
			});
		}
	},
}